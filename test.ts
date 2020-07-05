/*
 * macroable
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import test from 'japa'
import { Macroable } from './index'

class Parent extends Macroable {}
Parent['macros'] = {}
Parent['getters'] = {}

test.group('Macroable', (group) => {
	group.afterEach(() => {
		Parent.hydrate()
	})

	test('define a macro', (assert) => {
		function fooFn() {}
		Parent.macro('foo', fooFn)
		assert.equal(Parent.getMacro('foo'), fooFn)
		assert.equal((new Parent() as any).foo, fooFn)
	})

	test('return false from {hasMacro} for unregistered macro', (assert) => {
		assert.isFalse(Parent.hasMacro('foo'))
	})

	test('return true from {hasMacro} for registered macro', (assert) => {
		Parent.macro('foo', function foo() {})
		assert.equal(Parent.hasMacro('foo'), true)
	})

	test('define a getter', (assert) => {
		Parent.getter('foo', function foo() {
			return 'bar'
		})

		assert.equal(new Parent()['foo'], 'bar')
	})

	test('return false from {hasGetter} for unregistered getter', (assert) => {
		assert.equal(Parent.hasGetter('foo'), false)
	})

	test('return true from {hasGetter} for registered getter', (assert) => {
		Parent.getter('foo', function foo() {})
		assert.equal(Parent.hasGetter('foo'), true)
	})

	test('should be called everytime when fetched', (assert) => {
		let calledCount = 0
		Parent.getter('foo', function foo() {
			calledCount++
			return 'bar'
		})

		assert.equal(new Parent()['foo'], 'bar')
		assert.equal(new Parent()['foo'], 'bar')
		assert.equal(calledCount, 2)
	})

	test('clean class prototype and temporary values on calling hydrate', (assert) => {
		Parent.getter('foo', function foo() {})
		Parent.macro('bar', function bar() {})

		Parent.hydrate()

		assert.deepEqual(Parent['macros'], {})
		assert.deepEqual(Parent['getters'], {})
		assert.equal(new Parent()['foo'], undefined)
		assert.equal(new Parent()['bar'], undefined)
	})

	test('static methods should not be shared', (assert) => {
		class Foo extends Macroable {}
		Foo['macros'] = {}
		Foo['getters'] = {}

		class Bar extends Macroable {}
		Bar['macros'] = {}
		Bar['getters'] = {}

		Foo.macro('foo', function foo() {})
		assert.isFunction(Foo.getMacro('foo'))
		assert.isFunction(Foo.prototype['foo'])
		assert.isUndefined(Bar.getMacro('foo'))
		assert.isUndefined(Bar.prototype['foo'])
	})

	test('define a singleton getter', (assert) => {
		let getterCalledCounts = 0

		Parent.getter(
			'foo',
			function foo() {
				getterCalledCounts++
				return 'bar'
			},
			true
		)

		const m = new Parent()

		assert.equal(m['foo'], 'bar')
		assert.equal(m['foo'], 'bar')
		assert.equal(getterCalledCounts, 1)
	})

	test('singleton should be instance specific', (assert) => {
		let getterCalledCounts = 0

		Parent.getter(
			'foo',
			function foo() {
				getterCalledCounts++
				return 'bar'
			},
			true
		)

		const m = new Parent()
		const m1 = new Parent()

		assert.equal(m['foo'], 'bar')
		assert.equal(m['foo'], 'bar')
		assert.equal(m1['foo'], 'bar')
		assert.equal(m1['foo'], 'bar')
		assert.equal(getterCalledCounts, 2)
	})

	test('raise exception when macros and getters are not initiated as objects', (assert) => {
		class Foo extends Macroable {}
		const fn = () => new Foo()
		assert.throw(fn, 'Set static properties "macros = {}" and "getters = {}" on the class for the macroable to work.')
	})
})
