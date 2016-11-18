var assert = require('assert')
var fs = require('fs')
var path = require('path')
var level = require('level')
var encoding = require('dat-encoding')

module.exports = function (dir, opts, cb) {
  assert.ok(dir, 'directory required to create .dat folder')
  assert.equal(typeof dir, 'string', 'directory must be a string')
  if (typeof opts === 'function') cb = opts
  assert.equal(typeof cb, 'function', 'cb must be a function')

  var DB_KEY = '!dat!key' // key is stored in level db under this key

  var exists = false
  var dbDir = path.join(dir, opts.dbName || '.dat')
  try {
    fs.accessSync(dbDir, fs.F_OK)
    exists = true
  } catch (e) { }

  var db = level(dbDir)
  // db didn't exist, so we know not resumed
  if (!exists) return cb(null, db, null, putKey)
  getKey(db, function (err, existingKey) {
    if (err) return cb(err)
    cb(null, db, existingKey, putKey)
  })

  function getKey (db, cb) {
    db.get(DB_KEY, function (err, value) {
      if (err && !err.notFound) return cb(err)
      cb(null, encoding.decode(value))
    })
  }

  function putKey (key, cb) {
    if (!key) return cb('key required')
    if (typeof key !== 'string') key = encoding.encode(key)
    db.put(DB_KEY, key, cb)
  }
}
