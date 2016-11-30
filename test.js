var fs = require('fs')
var path = require('path')
var test = require('tape')
var rimraf = require('rimraf')
var hyperdrive = require('hyperdrive')

var datDb = require('.')
var key

test('creates .dat database', function (t) {
  var dir = path.join(__dirname, '.dat')
  rimraf.sync(dir)
  datDb(__dirname, function (err, db, existingKey, saveKey) {
    t.error(err, 'no callback error')
    t.ok(db, 'returns db')
    t.ok(!existingKey, 'no existing key')
    t.equal(typeof saveKey, 'function', 'saveKey is a function')
    t.doesNotThrow(function () { checkDirExists(dir) }, 'dat folder created')
    db.close(function () {
      t.end()
    })
  })
})

// make sure this test goes after the one that doesn't save key!
test('does not resume if key not saved', function (t) {
  rimraf.sync(path.join(__dirname, '.dat'))
  datDb(__dirname, function (err, db, existingKey, saveKey) {
    t.error(err, 'no callback error')
    t.ok(db, 'returns db')
    t.ok(!existingKey, 'no existing key still')
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

// make sure this test goes after one that saves key
test('resumes .dat database after key is saved', function (t) {
  datDb(__dirname, function (err, db, existingKey) {
    t.error(err, 'no callback error')
    t.ok(db, 'returns db')
    t.same(existingKey, key, 'existing key matches')
    rimraf.sync(path.join(__dirname, '.dat'))
    t.end()
  })
})

test('no dir fails', function (t) {
  t.throws(datDb, 'throws with no args')
  t.throws(function () { datDb({}) }, 'throws with only opts arg')
  t.throws(function () { datDb(noop) }, 'throws with only cb arg')
  t.throws(function () { datDb({}, noop) }, 'throws with opts and cb arg')
  t.end()
})

test('opts.dbName option creates different db', function (t) {
  var dbName = '.datSpecial'
  var dir = path.join(__dirname, dbName)
  rimraf.sync(dbName)
  datDb(__dirname, {dbName: dbName}, function (err, db, existingKey, saveKey) {
    t.error(err, 'no callback error')
    t.ok(db, 'returns db')
    t.ok(!existingKey, 'no existing key')
    t.doesNotThrow(function () { checkDirExists(dir) }, 'special dat folder created')
    db.close(function () {
      rimraf.sync(dbName)
      t.end()
    })
  })
})

test('lock error passed to callback', function (t) {
  t.skip('TODO')
  t.end()
})

function checkDirExists (dir) {
  fs.accessSync(dir, fs.F_OK)
}

function noop () { }
