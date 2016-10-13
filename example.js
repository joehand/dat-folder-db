var hyperdrive = require('hyperdrive')
var swarm = require('hyperdrive-archive-swarm')
var raf = require('random-access-file')
var encoding = require('dat-encoding')
var datFolder = require('.')

// Run twice to see how resume works!
datFolder({dir: __dirname}, function (err, db, existingKey) {
  if (err) throw err
  var resume = !!existingKey // resume the dat if a key exists
  if (resume) console.log('existing key', existingKey)
  // use db with hyperdrive
  var drive = hyperdrive(db)
  var archive = drive.createArchive(existingKey, {
    file: function (name) {
      return raf(name)
    }
  })
  archive.append('example.js')
  swarm(archive)

  // Put new key into database so we can resume
  if (!resume) db.put('!dat!key', encoding.encode(archive.key))

  console.log('sharing archive:', encoding.encode(archive.key))
})
