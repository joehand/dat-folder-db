# dat-folder-db [![Travis](https://img.shields.io/travis/joehand/dat-folder-db.svg?style=flat-square)](https://travis-ci.org/joehand/dat-folder-db) [![npm](https://img.shields.io/npm/v/dat-folder-db.svg?style=flat-square)](https://npmjs.org/package/dat-folder-db)

Make Dat CLI compatible databases. A database made with `dat-folder-db` can be resumed with the Dat CLI.

Wrapper of level to create/resume a `.dat` folder database. If there is an existing `.dat` folder, it will get the key of the existing dat, allowing it to be resumed.

Use in Dat applications using node and the file system to store the database.

## Usage

```js
var datDb = require('dat-folder-db')
datDb(dir, function (err, db, existingKey, putKey) {
  if (err) throw err
  var resume = !!existingKey // resume the dat if a key exists

  // use db with hyperdrive
  var drive = hyperdrive(db)
  var archive = drive.createArchive(existingKey)

  if (!resume) putkey(archive.key, function () {
    // key in db. can resume now
  })
})
```

This will create a `.dat` folder: `my_folder/.dat` and a `level` database in that folder.

See `example.js` for a full example.

## API

### `datFolder(dir, [opts], cb)`

Creates a level db in the `.dat` folder and checks if there is an existing key saved there.

* `dir` is required. This is the base path for the dat folder. 
* `cb` is called with `(err, db, existingKey, saveKey)`
  * `db` is the level database in `dir/.dat`
  * `existingKey` is the key found in the database or null if nothing is found.
  * `saveKey` is a function to save the key back to the database.

`opts` include:

```js
opts = {
  dbName : '.dat' // use a different name for the database
}
```

## License 

MIT
