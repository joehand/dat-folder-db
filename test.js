var path = require('path')
var test = require('tape')
var rimraf = require('rimraf')
var hyperdrive = require('hyperdrive')
var encoding = require('dat-encoding')

var datDb = require('.')
var key

test('creates .dat database', function (t) {
  rimraf.sync(path.join(__dirname, '.dat'))
  datDb(__dirname, function (err, db, existingKey, saveKey) {
    t.error(err, 'no callback error')
    t.ok(db, 'returns db')
    t.ok(!existingKey, 'no existing key')
    var drive = hyperdrive(db)
    var archive = drive.createArchive()
    key = archive.key
    saveKey(archive.key, function () {
      db.close(function () {
        t.end()
      })
    })
  })
})

test('resumes .dat database', function (t) {
  datDb(__dirname, function (err, db, existingKey) {
    t.error(err, 'no callback error')
    t.ok(db, 'returns db')
    t.same(encoding.decode(existingKey), key, 'existing key matches')
    rimraf.sync(path.join(__dirname, '.dat'))
    t.end()
  })
})
