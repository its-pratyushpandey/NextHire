var stream = require( 'stream' )
var path = require( 'path' )
var fs = require( 'fs' )
var { Minimatch } = require( 'minimatch' )

class DirTreeStream extends stream.Readable {

  constructor( options ) {

    super({ objectMode: true })

    this.depth = options && options.depth || Infinity
    this.path = options && options.path || null
    this.ignore = options && options.ignore ?
      [].concat( options.ignore ) : []

    if( this.path == null || typeof this.path != 'string' ) {
      throw new Error( 'Missing or invalid path option' )
    }

    this._depth = 0 // TODO
    this._paths = [ this.path ]
    this._currentPath = null
    this._currentDir = null
    this._matchers = this.ignore.map(( pattern ) => {
      return new Minimatch( pattern, { matchBase: true })
    })

  }

  _shouldIgnore( filename ) {
    for( var i = 0; i < this._matchers.length; i++ ) {
      if( this._matchers[i].match( filename ) ) {
        return true
      }
    }
    return false
  }

  _statSync( filename ) {
    return {
      name: path.relative( this.path, filename ),
      path: filename,
      realpath: fs.realpathSync( filename ),
      stats: fs.statSync( filename ),
    }
  }

  _read( size ) {

    size = size || 16

    if( !this._paths.length && this._currentDir == null ) {
      this.push( null )
      return
    }

    if( this._currentDir == null ) {
      this._currentPath = this._paths.shift()
      this._currentDir = fs.opendirSync( this._currentPath )
    }

    var dirEnt = null
    var filesRead = 0

    while( size-- && ( dirEnt = this._currentDir.readSync() ) ) {
      let filename = path.join( this._currentPath, dirEnt.name )
      let relative = path.relative( this.path, filename )
      if( this._shouldIgnore( relative ) ) { continue }
      let file = this._statSync( filename )
      if( file.stats.isDirectory() ) {
        this._paths.push( filename )
      } else {
        this.push( file )
        filesRead++
      }
    }

    // Close the directory, if there are no more files to enumerate
    if( dirEnt == null ) {
      this._currentDir.closeSync()
      this._currentDir = null
    }

    // If we didn't read any files from the directory
    // on this pass, continue with the next directory
    if( filesRead == 0 ) {
      this._read( size )
    }

  }

}

module.exports = DirTreeStream
