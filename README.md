<div align="center"><img src="https://res.cloudinary.com/adonisjs/image/upload/q_100/v1557762307/poppinss_iftxlt.jpg" width="600px"></div>

# Macroable

> Extend `class` prototype in style 😎

[![circleci-image]][circleci-url] [![typescript-image]][typescript-url] [![npm-image]][npm-url] [![license-image]][license-url] [![audit-report-image]][audit-report-url]

Base class for exposing external API to extend the class prototype in a more declarative way.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Table of contents

- [Traditional approach](#traditional-approach)
- [Using macroable](#using-macroable)
  - [Defining singleton getters](#defining-singleton-getters)
  - [Hydrating the class](#hydrating-the-class)

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
  },
})
```

## Using macroable

```ts
import { Macroable } from 'macroable'

class Foo extends Macroable {}

Foo.macros = {}
Foo.getters = {}

export default Foo
```

```ts
import Foo from './Foo'

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

[circleci-image]: https://img.shields.io/circleci/project/github/poppinss/macroable/master.svg?style=for-the-badge&logo=circleci
[circleci-url]: https://circleci.com/gh/poppinss/macroable 'circleci'
[typescript-image]: https://img.shields.io/badge/Typescript-294E80.svg?style=for-the-badge&logo=typescript
[typescript-url]: "typescript"
[npm-image]: https://img.shields.io/npm/v/macroable.svg?style=for-the-badge&logo=npm
[npm-url]: https://npmjs.org/package/macroable 'npm'
[license-image]: https://img.shields.io/npm/l/macroable?color=blueviolet&style=for-the-badge
[license-url]: LICENSE.md 'license'
[audit-report-image]: https://img.shields.io/badge/-Audit%20Report-blueviolet?style=for-the-badge
[audit-report-url]: https://htmlpreview.github.io/?https://github.com/poppinss/macroable/blob/develop/npm-audit.html 'audit-report'
