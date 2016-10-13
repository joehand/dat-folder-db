var fs = require('fs')
var path = require('path')
var level = require('level-party')

module.exports = function (opts, cb) {
  if (!opts.dir) return cb('directory required')

  var exists = false
  var datDir = path.join(opts.dir, '.dat')
  try {
    fs.accessSync(datDir, fs.F_OK)
    exists = true
  } catch (e) { fs.mkdirSync(datDir) }

  var db = level(datDir)
  if (!exists) return cb(null, db)
  getKey(db, function (err, existingKey) {
    if (err) return cb(err)
    cb(null, db, existingKey)
  })

  function getKey (db, cb) {
    db.get('!dat!key', function (err, value) {
      if (err && !err.notFound) return cb(err)
      cb(null, value)
    })
  }
}
