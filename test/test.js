'use strict'

var test = require('tape')
var React = require('react')
var deepResolve = require('..')

test('resolve a number', function (t) {
  t.plan(1)

  deepResolve(1).then(function (n) {
    t.equal(n, 1)
  })
})

test('resolve an object', function (t) {
  t.plan(1)

  deepResolve({
    foo: Promise.resolve({ bar: Promise.resolve(3) }),
    baz: '123',
    qux: [1, 2, '3', [Promise.resolve(4), {foo: Promise.resolve('bar')}]]
  }).then(function (resolved) {
    t.deepEqual(resolved, {
      foo: {
        bar: 3
      },
      baz: '123',
      qux: [1, 2, '3', [4, {foo: 'bar'}]]
    })
  })
})

test('resolve an array', function (t) {
  t.plan(1)

  deepResolve([
    1,
    Promise.resolve(2),
    [3],
    Promise.resolve([4])
  ]).then(function (resolved) {
    t.deepEqual(resolved, [
      1,
      2,
      [3],
      [4]
    ])
  })
})

test('resolve a date', function (t) {
  t.plan(2)

  deepResolve(Promise.resolve(new Date(1970, 0, 1))).then(function (resolved) {
    t.equal(+new Date(1970, 0, 1), +resolved)
  })
  deepResolve(Promise.resolve([new Date(1970, 0, 1)])).then(function (resolved) {
    t.equal(+new Date(1970, 0, 1), +resolved[0])
  })
})

test('resolve a function', function (t) {
  t.plan(1)

  var fn = Function.call  // nop
  deepResolve(Promise.resolve(fn)).then(function (resolved) {
    t.equal(resolved, fn)
  })
})

test('resolve react elements', function (t) {
  t.plan(1)

  var Comp = Function.call  // nop
  var el = React.createElement(Comp, {})

  deepResolve(el).then(function (resolved) {
    t.deepEqual(resolved, el)
  })
})

test('reject with errors', function (t) {
  t.plan(2)

  deepResolve([Promise.reject(4)]).then(function (resolved) {
    t.fail()
  }, function(rejection) {
    t.equal(rejection, 4)
  })

  deepResolve({foo: Promise.reject('bar')}).then(function (resolved) {
    t.fail()
  }, function (rejection) {
    t.equal(rejection, 'bar')
  })
})
