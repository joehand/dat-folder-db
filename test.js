var path = require('path')
var test = require('tape')
var rimraf = require('rimraf')
var hyperdrive = require('hyperdrive')
var encoding = require('dat-encoding')

var getFolder = require('.')
var key

test('creates .dat database', function (t) {
  rimraf.sync(path.join(__dirname, '.dat'))
  getFolder({dir: __dirname}, function (err, db, existingKey) {
    t.error(err, 'no callback error')
    t.ok(db, 'returns db')
    t.ok(!existingKey, 'no existing key')
    var drive = hyperdrive(db)
    var archive = drive.createArchive()
    key = archive.key
    db.put('!dat!key', encoding.encode(archive.key), function () {
      t.end()
    })
  })
})

test('resumes .dat database', function (t) {
  getFolder({dir: __dirname}, function (err, db, existingKey) {
    t.error(err, 'no callback error')
    t.ok(db, 'returns db')
    t.same(encoding.decode(existingKey), key, 'existing key matches')
    rimraf.sync(path.join(__dirname, '.dat'))
    t.end()
  })
})
