# Macroable
> Extend `class` prototype in style 😎

[![travis-image]][travis-url]
[![appveyor-image]][appveyor-url]
[![coveralls-image]][coveralls-url]
[![npm-image]][npm-url]
![](https://img.shields.io/badge/Uses-Typescript-294E80.svg?style=flat-square&colorA=ddd)

Macroable is a simple class that your classes can extend in order to expose an API for extending the class. Let's see how a class can be extended without Macroable first.

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

## Using macroable it's simpler

```js
const { Macroable } from 'macroable'

class Foo extends Macroable {
}

Foo._macros = {}
Foo._getters = {}

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

You can see the API is simpler and less verbose. However, their are couple more benefits to using Macroable.

1. You can add singleton getters, which are evaluated only once and then cached value is returned.
2. Cleanup all `macros` and `getters` added using Macroable.

## Installation
```bash
npm i macroable
```

## Usage
```js
const { Macroable } from 'macroable'

class Foo extends Macroable {
}

Foo._macros = {}
Foo._getters = {}

module.exports = Foo
```

## API

#### macro(name, callback) => void
Add a function to the prototype

```js
Foo.macro('greet', function (name) {
  return `Hello ${name}!`
})
```

#### hasMacro(name) => boolean
Find if macro exists.

```js
Foo.hasMacro('greet')
```

#### getter(name, callback, isSingleton?) => void
Add getter to the prototype and optionally make it singleton.

```js
Foo.getter('username', function () {
  return 'virk'
}, true)
```

#### hasGetter(name) => boolean
Find if getter exists.

```js
Foo.hasGetter('greet')
```

#### hydrate
Remove all macros and getters added using `Macroable`.

```js
Foo.getter('username', function () {
  return 'virk'
}, true)

Foo.hydrate()

Foo.hasGetter('username') // false
```

## Change log

The change log can be found in the [CHANGELOG.md](CHANGELOG.md) file.

## Contributing

Everyone is welcome to contribute. Please go through the following guides, before getting started.

1. [Contributing](https://adonisjs.com/contributing)
2. [Code of conduct](https://adonisjs.com/code-of-conduct)


## Authors & License
[thetutlage](https://github.com/thetutlage) and [contributors](https://github.com/poppinss/macroable/graphs/contributors).

MIT License, see the included [MIT](LICENSE.md) file.

[travis-image]: https://img.shields.io/travis/poppinss/macroable/master.svg?style=flat-square&logo=travis
[travis-url]: https://travis-ci.org/poppinss/macroable "travis"

[appveyor-image]: https://img.shields.io/appveyor/ci/thetutlage/macroable/master.svg?style=flat-square&logo=appveyor
[appveyor-url]: https://ci.appveyor.com/project/thetutlage/macroable "appveyor"

[coveralls-image]: https://img.shields.io/coveralls/poppinss/macroable/master.svg?style=flat-square
[coveralls-url]: https://coveralls.io/github/poppinss/macroable "coveralls"

[npm-image]: https://img.shields.io/npm/v/macroable.svg?style=flat-square&logo=npm
[npm-url]: https://npmjs.org/package/macroable "npm"
