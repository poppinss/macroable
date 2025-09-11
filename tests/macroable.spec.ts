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
      declare foo: string
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
      declare foo: () => string
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
      declare foo: () => string
      bar = 'bar'
    }

    Parent.macro('foo', () => {
      expectTypeOf(this).toEqualTypeOf<undefined>()
      return (this as any).bar
    })

    assert.throws(() => new Parent().foo(), "Cannot read properties of undefined (reading 'bar')")
  })
})

test.group('Macroable | instanceProperty', () => {
  test('destructure instance property and retain this', ({ expectTypeOf, assert }) => {
    class Parent extends Macroable {
      declare foo: () => string
      bar = 'bar'
    }

    Parent.instanceProperty('foo', function foo(this: Parent) {
      expectTypeOf(this).toEqualTypeOf<Parent>()
      return this.bar
    })

    const parent = new Parent()
    const { foo } = parent
    assert.equal(foo(), 'bar')
  })

  test('define instance properties with multi-layered inheritance', ({ assert }) => {
    class BaseUser extends Macroable {
      declare getCreatedAt: () => string
      declare getUpdatedAt: () => string

      constructor(
        protected createdAt: string,
        protected updatedAt: string
      ) {
        super()
        this.createdAt = createdAt
        this.updatedAt = updatedAt
      }
    }

    class User extends BaseUser {
      declare getName: () => string
      constructor(
        protected name: string,
        createdAt: string,
        updatedAt: string
      ) {
        super(createdAt, updatedAt)
      }
    }

    BaseUser.instanceProperty('getCreatedAt', function (this: BaseUser) {
      return this.createdAt
    })
    BaseUser.instanceProperty('getUpdatedAt', function (this: BaseUser) {
      return this.updatedAt
    })
    User.instanceProperty('getName', function foo(this: User) {
      return this.name
    })

    const user = new User('virk', '2020-10-03', '2020-10-04')
    const { getName, getCreatedAt, getUpdatedAt } = user

    assert.equal(getName(), 'virk')
    assert.equal(getCreatedAt(), '2020-10-03')
    assert.equal(getUpdatedAt(), '2020-10-04')
  })
})

test.group('Macroable | getter', () => {
  test('define a getter', ({ assert }) => {
    let counter = 0

    class Parent extends Macroable {
      declare getCount: number
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
      declare getCount: number
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

  test('getter function should be called with parent this context', ({ assert, expectTypeOf }) => {
    class Parent extends Macroable {
      declare getter: any
    }

    Parent.getter('getter', function getter(this: Parent) {
      expectTypeOf(this).toEqualTypeOf<Parent>()
      return this
    })

    const parent = new Parent()
    assert.strictEqual(parent.getter, parent)
  })

  test('destructure getter and retain this', ({ assert, expectTypeOf }) => {
    class Parent extends Macroable {
      declare getter: any
    }

    Parent.getter('getter', function getter(this: Parent) {
      expectTypeOf(this).toEqualTypeOf<Parent>()
      return this
    })

    const parent = new Parent()
    const { getter } = parent
    assert.strictEqual(getter, parent)
  })

  test('destructure getter values and retain this', ({ assert, expectTypeOf }) => {
    class Parent extends Macroable {
      declare getter: { self: Parent }
    }

    Parent.getter('getter', function getter(this: Parent) {
      expectTypeOf(this).toEqualTypeOf<Parent>()
      return { self: this }
    })

    const parent = new Parent()
    const { self } = parent.getter
    assert.strictEqual(self, parent)
  })

  test('re-assign getter', ({ assert }) => {
    let counter = 0

    class Parent extends Macroable {
      declare getCount: number
    }

    Parent.getter(
      'getCount',
      function getCount() {
        counter++
        return counter
      },
      true
    )

    Parent.getter(
      'getCount',
      function getCount() {
        counter += 2
        return counter
      },
      true
    )

    const parent = new Parent()
    assert.equal(parent.getCount, 2)
    assert.equal(parent.getCount, 2)
    assert.equal(parent.getCount, 2)
    assert.isTrue(Object.hasOwn(parent, 'getCount'))
    assert.equal(counter, 2)
  })

  test('fail when trying to overwrite instance value with a literal value', ({ assert }) => {
    let counter = 0

    class Parent extends Macroable {
      declare getCount: number
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
    assert.throws(() => (parent.getCount = 2), /Cannot assign to read only property/)
  })

  test('fail when trying to overwrite getter with a literal value', ({ assert }) => {
    let counter = 0

    class Parent extends Macroable {
      declare getCount: number
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
    assert.throws(() => (parent.getCount = 2), /Cannot set property/)
  })
})
