'use strict'

module.exports = function deepResolve(p) {
  return Promise.resolve(p).then(function (p) {
    if (typeof p.length === 'number' && typeof p !== 'string') {
      return Promise.all(p.map(deepResolve))
    } else if (p !== null && typeof p === 'object' && !(p instanceof Date)) {
      var keys = Object.keys(p)
      var values = keys.map(function(key) { return deepResolve(p[key]) })
      return Promise.all(values)
        .then(function(values) {
          var out = {}
          for (var i = 0; i < keys.length; i++) {
            out[keys[i]] = values[i]
          }
          return out
        })
    } else {
      return Promise.resolve(p)
    }
  })
}
