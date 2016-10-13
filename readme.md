# dat-folder-db

Wrapper of level to create/resume a `.dat` folder database. If there is an existing `.dat` folder, it will get the key of the existing dat, allowing it to be resumed.

```js
var datFolder = require('dat-folder-db')
datFolder({dir: 'my_folder'}, function (err, db, existingKey) {
  if (err) throw err
  var resume = !!existingKey // resume the dat if a key exists
  // use db with hyperdrive
  var drive = hyperdrive(db)
  var archive = drive.createArchive(existingKey)
})
```

This will create a `.dat` folder: `my_folder/.dat` and a `level-party` database in that folder.

See `example.js` for a full example.

## API

### `datFolder(opts, cb)`

Creates a level db in the `.dat` folder and checks if there is an existing key saved there.

* `opts.dir` is required. This is the base path for the dat folder. 
* `cb` is called with `(err, db, existingKey)` where `db` is a level-party database in `dir/.dat`

## License 

MIT
