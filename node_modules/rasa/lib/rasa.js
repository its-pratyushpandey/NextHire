var fs = require( 'fs' )
var rasa = module.exports

rasa.Archive = require( './archive' )
rasa.Filesystem = require( './filesystem' )

rasa.pack = require( './pack' )

rasa.listPackage = ( filename ) => {

  var offset = 0
  var length = 4
  var position = 12
  var buffer = Buffer.alloc( length )

  var fd = fs.openSync( filename, 'r' )

  fs.readSync( fd, buffer, offset, length, position )

  length = buffer.readUInt32LE( 0 )
  position = 16
  buffer = Buffer.alloc( length )

  fs.readSync( fd, buffer, offset, length, position )
  fs.closeSync( fd )

  var index = JSON.parse( buffer.toString() )

  return rasa.Archive.flattenIndex( index )

}
