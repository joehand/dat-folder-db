var hyperdrive = require('hyperdrive')
var datDb = require('.')

// Run twice to see how resume works!
datDb(__dirname, function (err, db, key, putKey) {
  if (err) throw err
  var drive = hyperdrive(db)
  var archive = drive.createArchive(key)

  if (key) console.log('.dat directory was resumed')
  putKey(archive.key, function () {
    // save the key back to DB so you can resume.

    // do stuff with Dat Archive
  })
})
