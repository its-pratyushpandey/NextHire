var stream = require( 'stream' )
var fs = require( 'fs' )
var path = require( 'path' )
var crypto = require( 'crypto' )
var DirTreeStream = require( '../lib/dir-tree-stream' )

var defaultCollator = new Intl.Collator( 'en-US', {
  localeMatcher: 'best fit', // lookup
  usage: 'sort', // search
  sensitivity: 'variant', // base, accent, case
  ignorePunctuation: false,
  numeric: true,
})

/**
 * Check wehether a file mode marks it as "executable"
 * @param {Number} mode
 * @returns {Boolean}
 */
function isExecutable( mode ) {

  var owner = mode >> 6
  var group = ( mode << 3 ) >> 6
  var other = ( mode << 6 ) >> 6

  return ( owner & 1 ) || ( group & 1 ) || ( other & 1 )

}

/**
 * Add a file to an index
 * @param {Object} index
 * @param {Object} file
 */
function addToIndex( index, file ) {

  var dirname = path.dirname( file.name )
  var parts = dirname.split( path.sep )
  var part = null
  var dir = index

  dir.files = dir.files || Object.create( null )

  if( dirname != '.' ) {
    while( part = parts.shift() ) {
      dir.files[ part ] = dir.files[ part ] || Object.create( null )
      dir = dir.files[ part ]
      dir.files = dir.files || Object.create( null )
    }
  }

  var basename = path.basename( file.name )

  dir.files[ basename ] = {
    offset: file.offset.toString(),
    size: file.stats.size,
  }

  if( isExecutable( file.stats.mode ) ) {
    dir.files[ basename ].executable = true
  }

}

/**
 * Build a deduplicated index of files
 * @param {Array<Object>} files
 * @returns {Object} index
 */
function buildIndex( files, dedupe ) {

  var index = Object.create( null )
  var globalOffset = 0

  for( var i = 0; i < files.length; i++ ) {
    let file = files[i]
    let dupes = dedupe.get( file.hash )
    let indexOf = dupes.indexOf( file )
    if( indexOf == 0 ) {
      file.offset = globalOffset
      globalOffset += file.stats.size
    } else {
      file.offset = dupes[0].offset
    }
  }

  for( var i = 0; i < files.length; i++ ) {
    addToIndex( index, files[i] )
  }

  return index

}

function createHashStream( algorithm ) {

  algorithm = algorithm || 'sha256'

  return new stream.Transform({
    objectMode: true,
    transform( file, _, next ) {

      if( !file.stats.isFile() || file.stats.isDirectory() ) {
        return next() // next( null, file )
      }

      var readable = fs.createReadStream( file.path )
      var hash = crypto.createHash( algorithm )

      stream.pipeline( readable, hash, ( error ) => {
        if( !error ) file.hash = hash.digest( 'hex' )
        next( error, file )
      })

    }
  })

}

/**
 * Create a file packing stream
 * @param {Number} fd
 * @param {Number} offset
 * @returns {stream.Transform}
 */
function createPackStream( fd, offset ) {
  return new stream.Transform({
    objectMode: true,
    transform( file, _, next ) {

      var readable = fs.createReadStream( file.path )
      var writable = fs.createWriteStream( null, {
        start: file.offset + offset,
        autoClose: false,
        fd: fd,
      })

      stream.pipeline( readable, writable, ( error ) => {
        next( error, file )
      })

    }
  })
}

/**
 * Write an archive header with a given file index
 * @param {Number} fd
 * @param {Object} index
 * @param {Function} callback
 */
function writeArchiveHeader( fd, index, callback ) {

  var jsonIndex = JSON.stringify( index )
  var jsonLength = Buffer.byteLength( jsonIndex )
  var header = Buffer.alloc( 16 + jsonLength )

  // Manually Chromium-Pickle it – not worth adding a dependency over 16 bytes
  header.writeUInt32LE( 4, 0 ) // = 4 (length of the follwing uint32 size)
  header.writeUInt32LE( jsonLength + 8, 4 ) // = indexLength + 8 (size of the header)
  header.writeUInt32LE( jsonLength + 4, 8 ) // = indexLength + 4 (size of the header data)
  header.writeUInt32LE( jsonLength, 12 ) // = indexLength (size of the header payload)
  header.write( jsonIndex, 16, jsonLength, 'utf8' )

  fs.write( fd, header, 0, header.length, 0, callback )

}

/**
 * Write an archive based on an index and deduplication map
 * @param {String} filename
 * @param {Object} index
 * @param {Map} dedupe
 * @param {Function} callback
 */
function writeArchive( filename, index, dedupe, callback ) {

  fs.open( filename, 'w+', ( error, fd ) => {

    if( error ) {
      return void callback( error )
    }

    writeArchiveHeader( fd, index, ( error, bytesWritten, header ) => {

      if( error ) {
        return void callback( error )
      }

      var packStream = createPackStream( fd, header.length )
      var onEnd = ( error ) => {
        fs.close( fd, ( closeError ) => {
          callback( error || closeError )
        })
      }

      var iter = dedupe.values()
      var files = iter.next()
      var feed = () => {
        while( !files.done && packStream.write( files.value[0] ) ) {
          files = iter.next()
        }
        if( files.done ) {
          packStream.end()
        }
      }

      packStream.on( 'error', onEnd )
      packStream.on( 'finish', onEnd )
      packStream.on( 'drain', feed )
      packStream.resume()

      feed()

    })

  })

}

/**
 * Create an asar archive
 * @param {String} src - source path / directory
 * @param {String} dst - output archive path
 * @param {Object} options
 * @param {Function} [options.transform] - function returning a transform stream
 * @param {String|Array<String>} [options.ignore] - glob patterns for files to be ignored
 * @param {Function} callback - callback( error )
 * @returns {Undefined}
 */
function pack( src, dst, options, callback ) {

  if( typeof options == 'function' ) {
    return pack( src, dst, {}, options )
  }

  options = options || {}

  var compare = ( a, b ) => {
    return defaultCollator.compare( a.path, b.path )
  }

  var hashStream = createHashStream( options.hashAlgorithm )
  var dirStream = new DirTreeStream({
    path: src,
    ignore: options.ignore,
  })

  var files = []
  var dedupe = new Map()
  var index = null

  var pipeline = stream.pipeline( dirStream, hashStream, ( error ) => {

    if( error ) {
      return callback( error )
    }

    files.sort( compare )

    // Make deduplication map
    for( var i = 0; i < files.length; i++ ) {
      dedupe.has( files[i].hash ) ?
        dedupe.get( files[i].hash ).push( files[i] ) :
        dedupe.set( files[i].hash, [ files[i] ] )
    }

    try {
      index = buildIndex( files, dedupe )
    } catch( e ) {
      return callback( e )
    }

    writeArchive( dst, index, dedupe, callback )

  })

  pipeline.on( 'readable', function() {
    var file = null
    while( file = this.read() ) {
      files.push( file )
    }
  })

}

module.exports = pack
