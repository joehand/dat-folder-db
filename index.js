var fs = require('fs')
var path = require('path')
var level = require('level')

module.exports = function (dir, opts, cb) {
  if (!dir) return cb('directory required')
  if (typeof opts === 'function') cb = opts

  var exists = false
  var datDir = path.join(dir, '.dat')
  try {
    fs.accessSync(datDir, fs.F_OK)
    exists = true
  } catch (e) { fs.mkdirSync(datDir) }

  var db = level(datDir)
  if (!exists) return cb(null, db, null, saveKey)
  getKey(db, function (err, existingKey) {
    if (err) return cb(err)
    cb(null, db, existingKey, saveKey)
  })

  function saveKey (key, cb) {
    if (!key) return cb('key required')
    if (typeof key !== 'string') key = key.toString('hex')
    db.put('!dat!key', key, cb)
  }

  function getKey (db, cb) {
    db.get('!dat!key', function (err, value) {
      if (err && !err.notFound) return cb(err)
      cb(null, value)
    })
  }
}
