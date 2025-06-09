# rasa
[![npm](https://img.shields.io/npm/v/rasa.svg?style=flat-square)](https://npmjs.com/package/rasa)
[![npm license](https://img.shields.io/npm/l/rasa.svg?style=flat-square)](https://npmjs.com/package/rasa)
[![npm downloads](https://img.shields.io/npm/dm/rasa.svg?style=flat-square)](https://npmjs.com/package/rasa)
[![build status](https://img.shields.io/travis/jhermsmeier/node-rasa/master.svg?style=flat-square)](https://travis-ci.org/jhermsmeier/node-rasa)

Dependency-less asar archive implementation

## Install via [npm](https://npmjs.com)

```sh
$ npm install --save rasa
```

## Differences

Compared to [electron/asar](https://github.com/electron/asar), rasa

- Has no dependencies
- Has no command line interface
- Provides error handling for all methods

## TODO

- [ ] Packing of files
- [ ] API compatibility with `asar`

## Usage

```js
var rasa = require( 'rasa' )
```

### Listing an archive's contents

```js
var files = rasa.listPackage( 'test/data/pack.asar' )
```

```js
> [ 'archive.js', 'filesystem.js', 'rasa.js' ]
```

### Opening an archive

```js
var archive = new rasa.Archive()
```

```js
archive.open( filename, ( error ) => {
  // Do things...
  console.log( 'files', rasa.Archive.listFiles( archive.root ) )
  // Close the handle to the archive
  archive.close()
})
```

### Reading a file

```js
archive.readFile( 'archive.js', function( error, buffer ) {
  // ...
})
```

### Reading directories

```js
var ls = archive.readdir( '/' )
```

### Streaming a file from an archive

```js
archive.createReadStream( 'archive.js' )
  .pipe( process.stdout )
```
