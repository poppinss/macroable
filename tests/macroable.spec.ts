/*
 * @poppinss/macroable
 *
 * (c) Poppinss
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { test } from '@japa/runner'
import Macroable from '../index.js'

test.group('Macroable | macro', () => {
  test('add a property to the class prototype', ({ expectTypeOf, assert }) => {
    class Parent extends Macroable {
      foo: string
    }

    Parent.macro('foo', 'bar')
    const parent = new Parent()

    expectTypeOf(Parent.macro<typeof Parent, 'foo'>).parameters.toEqualTypeOf<['foo', string]>()
    // @ts-expect-error
    expectTypeOf(Parent.macro<typeof Parent, 'bar'>).parameters.toEqualTypeOf<['bar', string]>()
    assert.equal(parent.foo, 'bar')
    assert.isFalse(Object.hasOwn(parent, 'foo'))
  })

  test('add a property as a function', ({ expectTypeOf, assert }) => {
    class Parent extends Macroable {
      foo: () => string
      bar = 'bar'
    }

    Parent.macro('foo', function foo(this: Parent) {
      expectTypeOf(this).toEqualTypeOf<Parent>()
      return this.bar
    })

    const parent = new Parent()
    assert.equal(parent.foo(), 'bar')
    assert.isFalse(Object.hasOwn(parent, 'foo'))
  })

  test('add a property as an arrow function', ({ expectTypeOf, assert }) => {
    class Parent extends Macroable {
      foo: () => string
      bar = 'bar'
    }

    Parent.macro('foo', () => {
      expectTypeOf(this).toEqualTypeOf<undefined>()
      return (this as any).bar
    })

    assert.throws(() => new Parent().foo(), "Cannot read properties of undefined (reading 'bar')")
  })
})

test.group('Macroable | getter', () => {
  test('define a getter', ({ assert }) => {
    let counter = 0

    class Parent extends Macroable {
      getCount: number
    }

    Parent.getter('getCount', function getCount() {
      counter++
      return counter
    })

    const parent = new Parent()
    assert.equal(parent.getCount, 1)
    assert.equal(parent.getCount, 2)
    assert.equal(parent.getCount, 3)
    assert.isFalse(Object.hasOwn(parent, 'getCount'))
    assert.equal(counter, 3)
  })

  test('define a singleton getter', ({ assert }) => {
    let counter = 0

    class Parent extends Macroable {
      getCount: number
    }

    Parent.getter(
      'getCount',
      function getCount() {
        counter++
        return counter
      },
      true
    )

    const parent = new Parent()
    assert.equal(parent.getCount, 1)
    assert.equal(parent.getCount, 1)
    assert.equal(parent.getCount, 1)
    assert.isTrue(Object.hasOwn(parent, 'getCount'))
    assert.equal(counter, 1)
  })
})
