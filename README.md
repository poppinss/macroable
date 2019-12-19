# Macroable
> Extend `class` prototype in style 😎

[![travis-image]][travis-url] [![appveyor-image]][appveyor-url] [![coveralls-image]][coveralls-url] [![typescript-image]][typescript-url] [![npm-image]][npm-url] [![license-image]][license-url]

Base class for exposing external API to extend the class prototype in a more declarative way.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Traditional approach

```js
class Foo {}
module.exports = Foo
```

Someone can extend it follows.

```js
const Foo = require('./Foo')
Foo.prototype.greet = function () {
  return 'Hello!'
}

// or add getter as follow
Object.defineProperty(Foo.prototype, 'username', {
  get: function () {
    return 'virk'
  }
})
```

## Using macroable

```js
const { Macroable } from 'macroable'

class Foo extends Macroable {
}

Foo.macros = {}
Foo.getters = {}

module.exports = Foo
```

```js
const Foo = require('./Foo')

Foo.macro('greet', function () {
  return 'Hello!'
})

Foo.getter('username', function () {
  return 'virk'
})
```

You can see the API is simpler and less verbose. However, there are couple of extra benefits of using Macroable.

### Defining singleton getters
Singleton getters are evaluated only once and then cached value is returned.

```js
Foo.getter('baseUrl', function () {
  return lazilyEvaluateAndReturnUrl()
}, true) 👈
```

### Hydrating the class
Using the `hydrate` method, you can remove macros and getters added on a given class.

```js
Foo.macro('greet', function (name) {
  return `Hello ${name}!`
})

Foo.getter('username', function () {
  return 'virk'
})

Foo.hydrate()  👈
Foo.greet // undefined
Foo.username // undefined
```

[travis-image]: https://img.shields.io/travis/poppinss/macroable/master.svg?style=for-the-badge&logo=travis
[travis-url]: https://travis-ci.org/poppinss/macroable "travis"

[appveyor-image]: https://img.shields.io/appveyor/ci/thetutlage/macroable/master.svg?style=for-the-badge&logo=appveyor
[appveyor-url]: https://ci.appveyor.com/project/thetutlage/macroable "appveyor"

[coveralls-image]: https://img.shields.io/coveralls/poppinss/macroable/master.svg?style=for-the-badge
[coveralls-url]: https://coveralls.io/github/poppinss/macroable "coveralls"

[typescript-image]: https://img.shields.io/badge/Typescript-294E80.svg?style=for-the-badge&logo=typescript
[typescript-url]:  "typescript"

[npm-image]: https://img.shields.io/npm/v/macroable.svg?style=for-the-badge&logo=npm
[npm-url]: https://npmjs.org/package/macroable "npm"

[license-image]: https://img.shields.io/npm/l/macroable?color=blueviolet&style=for-the-badge
[license-url]: LICENSE.md "license"
