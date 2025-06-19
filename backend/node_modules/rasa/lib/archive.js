var fs = require( 'fs' )
var path = require( 'path' )
var os = require( 'os' )

class Archive {

  constructor() {
    this.fd = null
    this.dataOffset = -1
    this.root = null
  }

  readBytes( position, length, callback ) {

    var offset = 0
    var buffer = Buffer.alloc( length )

    fs.read( this.fd, buffer, offset, length, position, ( error, bytesRead, buffer ) => {
      if( !error && bytesRead !== length ) {
        error = new Error( `Bytes read mismatch: Expected ${length}, got ${bytesRead}` )
      }
      callback.call( this, error, buffer )
    })

  }

  readIndex( callback ) {

    // Read the UInt32 that is the header/index length
    var length = 16 // 4
    // Because asar archives use Chromium's Pickle serialization,
    // we need to skip the first 12 bytes of metadata (see comment below)
    var position = 0 // length * 3

    // Clear our current index & data offset
    this.root = null
    this.dataOffset = -1

    this.readBytes( position, length, ( error, buffer ) => {
      if( error ) return void callback.call( this, error )
      // Chain of lengths of a block of JSON:
      // console.log( '0', buffer.readUInt32LE( 0 ) ) // = 4 (length of the follwing uint32 size)
      // console.log( '1', buffer.readUInt32LE( 4 ) ) // = indexLength + 8 (size of the header)
      // console.log( '2', buffer.readUInt32LE( 8 ) ) // = indexLength + 4 (size of the header data)
      // console.log( '3', buffer.readUInt32LE( 12 ) ) // = indexLength (size of the header payload)
      var indexLength = buffer.readUInt32LE( 12 )
      var position = 16
      this.dataOffset = position + indexLength
      this.readBytes( position, indexLength, ( error, buffer ) => {
        if( error ) return void callback.call( this, error )
        try {
          this.root = JSON.parse( buffer.toString() )
        } catch( e ) {
          error = e
        }
        callback.call( this, error, this.root )
      })
    })
  }

  getDirNode( dirname ) {

    if( this.root == null ) {
      return null
    }

    dirname = path.normalize( dirname )
    dirname = path.resolve( path.sep, dirname )

    var parts = dirname.split( path.sep )
    var node = this.root.files
    var dir = null

    parts.shift() // shift off the root

    if( parts.length === 0 ) {
      return this.root
    }

    while( dir = parts.shift() ) {
      if( node[ dir ] && node[ dir ].files ) {
        node = node[ dir ].files
      } else {
        return null
      }
    }

    return node

  }

  getFileNode( filename ) {

    var basename = path.basename( filename )
    var dirname = path.dirname( filename )
    var dirNode = this.getDirNode( dirname )

    return dirNode ? dirNode[ basename ] : null

  }

  readdir( dirname ) {
    var dirNode = this.getDirNode( dirname )
    return dirNode ? Object.keys( dirNode ) : null
  }

  readFile( filename, callback ) {

    var fileNode = this.getFileNode( filename )

    if( fileNode == null ) {
      var error = new Error( `ENOENT: no such file or directory, open '${filename}'` )
      error.code = 'ENOENT'
      error.errno = -os.constants.errno.ENOENT
      return process.nextTick( () => callback.call( this, error ) )
    }

    var position = this.dataOffset + (+fileNode.offset) + 1

    this.readBytes( position, fileNode.size, callback )

  }

  createReadStream( filename, callback ) {

    var fileNode = this.getFileNode( filename )

    if( fileNode == null ) {
      var error = new Error( `ENOENT: no such file or directory, open '${filename}'` )
      error.code = 'ENOENT'
      error.errno = -os.constants.errno.ENOENT
      return process.nextTick( () => callback.call( this, error ) )
    }

    var position = this.dataOffset + (+fileNode.offset)

    return fs.createReadStream( null, {
      fd: this.fd,
      autoClose: false,
      start: position + 1,
      end: position + fileNode.size,
    })

  }

  open( filename, options, callback ) {

    if( typeof options === 'function' ) {
      callback = options
      options = null
    }

    if( this.fd != null ) {
      this.close(( error ) => {
        this.open( filename, options, callback )
      })
      return
    }

    options = options || {}

    var tasks = [
      ( next ) => {
        fs.open( filename, options.flags || 'r', options.mode, ( error, fd ) => {
          this.fd = fd || null
          next( error )
        })
      },
      ( next ) => this.readIndex( next ),
    ]

    var run = ( error ) => {
      var task = tasks.shift()
      error || task == null ?
        callback.call( this, error ) :
        task( run )
    }

    run()

  }

  extract() {
    throw new Error( 'Not implemented' )
  }

  pack() {
    throw new Error( 'Not implemented' )
  }

  close( callback ) {
    fs.close( this.fd, ( error ) => {
      callback.call( this, error )
    })
    this.fd = null
  }

}

Archive.flattenIndex = ( tree ) => {

  var files = []

  function flatten( node, parent = '.', list ) {
    var keys = Object.keys( node.files )
    for( var i = 0; i < keys.length; i++ ) {
      list.push( path.join( parent, keys[i] ) )
      if( node.files[ keys[i] ].files ) {
        flatten( node.files[ keys[i] ], path.join( parent, keys[i] ), list )
      }
    }
    return list
  }

  return flatten( tree, '.', files )

}

Archive.listFiles = ( tree ) => {

  var files = []

  function listFiles( node, parent = '.', list ) {
    var keys = Object.keys( node.files )
    for( var i = 0; i < keys.length; i++ ) {
      !node.files[ keys[i] ].files ?
        list.push( path.join( parent, keys[i] ) ) :
        listFiles( node.files[ keys[i] ], path.join( parent, keys[i] ), list )
    }
    return list
  }

  return listFiles( tree, '.', files )

}

Archive.listDirs = ( tree ) => {

  var files = []

  function listDirs( node, parent = '.', list ) {
    var keys = Object.keys( node.files )
    for( var i = 0; i < keys.length; i++ ) {
      if( node.files[ keys[i] ].files ) {
        list.push( path.join( parent, keys[i] ) )
        listDirs( node.files[ keys[i] ], path.join( parent, keys[i] ), list )
      }
    }
    return list
  }

  return listDirs( tree, '.', files )

}

module.exports = Archive
