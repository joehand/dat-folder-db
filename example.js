var hyperdrive = require('hyperdrive')
var datDb = require('.')

// Run twice to see how resume works!
datDb(__dirname, {}, function (err, db, key, saveKey) {
  if (err) throw err
  var drive = hyperdrive(db)
  var archive = drive.createArchive(key)

  if (key) console.log('.dat directory was resumed')
  saveKey(archive.key, function () {
    // do stuff with dat

  })
})
