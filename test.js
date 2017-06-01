'use strict'

const test = require('japa')
const Macroable = require('./index')
class Parent extends Macroable {}
Parent._macros = {}
Parent._getters = {}

test.group('Macroable', (group) => {
  group.beforeEach(() => {
    Parent.hydrate()
  })

  test('define a macro', (assert) => {
    const fooFn = function () {}
    Parent.macro('foo', fooFn)
    assert.equal(Parent.getMacro('foo'), fooFn)
    assert.equal(new Parent().foo, fooFn)
  })

  test('throw exception when macro is not a function', (assert) => {
    const fooFn = 'foo'
    const fn = () => Parent.macro('foo', fooFn)
    assert.throw(fn, 'E_INVALID_PARAMETER: Parent.macro expects callback to be a function or an asyncFunction')
  })

  test('return false from {hasMacro} for unregistered macro', (assert) => {
    assert.equal(Parent.hasMacro('foo'), false)
  })

  test('return true from {hasMacro} for registered macro', (assert) => {
    Parent.macro('foo', function () {})
    assert.equal(Parent.hasMacro('foo'), true)
  })

  test('return false when removed macro from prototype', (assert) => {
    Parent.macro('foo', function () {})
    Reflect.deleteProperty(Parent.prototype, 'foo')
    assert.equal(Parent.hasMacro('foo'), false)
  })

  test('define a getter', (assert) => {
    Parent.getter('foo', function () {
      return 'bar'
    })
    assert.equal(new Parent().foo, 'bar')
  })

  test('return false from {hasGetter} for unregistered getter', (assert) => {
    assert.equal(Parent.hasGetter('foo'), false)
  })

  test('return true from {hasGetter} for registered getter', (assert) => {
    Parent.getter('foo', function () {})
    assert.equal(Parent.hasGetter('foo'), true)
  })

  test('return false when removed getter from prototype', (assert) => {
    Parent.getter('foo', function () {})
    Reflect.deleteProperty(Parent.prototype, 'foo')
    assert.equal(Parent.hasGetter('foo'), false)
  })

  test('should be called everytime when fetched', (assert) => {
    let calledCount = 0
    Parent.getter('foo', function () {
      calledCount++
      return 'bar'
    })
    /* eslint no-new: "off" */
    assert.equal(new Parent().foo, 'bar')
    assert.equal(new Parent().foo, 'bar')
    assert.equal(calledCount, 2)
  })

  test('throw exception when getter is not a function', (assert) => {
    const fooFn = 'foo'
    const fn = () => Parent.getter('foo', fooFn)
    assert.throw(fn, 'E_INVALID_PARAMETER: Parent.getter expects callback to be a function or an asyncFunction')
  })

  test('clean class prototype and temporary values on calling hydrate', (assert) => {
    Parent.getter('foo', function () {})
    Parent.macro('bar', function () {})
    Parent.hydrate()
    assert.deepEqual(Parent._macros, {})
    assert.deepEqual(Parent._getters, {})
    assert.equal(new Parent().foo, undefined)
    assert.equal(new Parent().bar, undefined)
  })

  test('static methods should not be shared', (assert) => {
    class Foo extends Macroable {}
    Foo._macros = {}
    Foo._getters = {}

    class Bar extends Macroable {}
    Bar._macros = {}
    Bar._getters = {}

    Foo.macro('foo', function () {})
    assert.isFunction(Foo.getMacro('foo'))
    assert.isFunction(Foo.prototype.foo)
    assert.isUndefined(Bar.getMacro('foo'))
    assert.isUndefined(Bar.prototype.foo)
  })

  test('define a singleton getter', (assert) => {
    let getterCalledCounts = 0
    Parent.getter('foo', function () {
      getterCalledCounts++
      return 'bar'
    }, true)
    const m = new Parent()
    assert.equal(m.foo, 'bar')
    assert.equal(m.foo, 'bar')
    assert.equal(getterCalledCounts, 1)
  })

  test('singleton should be instance specific', (assert) => {
    let getterCalledCounts = 0
    Parent.getter('foo', function () {
      getterCalledCounts++
      return 'bar'
    }, true)
    const m = new Parent()
    const m1 = new Parent()
    assert.equal(m.foo, 'bar')
    assert.equal(m.foo, 'bar')
    assert.equal(m1.foo, 'bar')
    assert.equal(m1.foo, 'bar')
    assert.equal(getterCalledCounts, 2)
  })
})
