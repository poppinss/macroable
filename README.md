# @poppinss/macroable
> Extend classes from outside in using Macros and getters

[![gh-workflow-image]][gh-workflow-url] [![typescript-image]][typescript-url] [![npm-image]][npm-url] [![license-image]][license-url] [![synk-image]][synk-url]

Macroable is a very simple implementation for adding properties and getters to the class prototype. You might not even need this package, if you are happy writing `Object.defineProperty` calls yourself.

## Usage
Install the package from npm packages registry as follows.

```sh
npm i @poppinss/macroable

# yarn lovers
yarn add @poppinss/macroable
```

And import the `Macroable` class.

```ts
import { Macroable } from '@poppinss/macroable'
export class Route extends Macroable {}
```

Now, you can add properties to the Route class from outside. This is usually required, when you want the consumer of your classes to be able to extend them by adding custom properties.

## Macros
Getters are added to the class prototype directly.

```ts
Route.macro('head', function (uri, callback) {
  return this.route(['HEAD'], uri, callback)
})
```

And now, you can will be use the `head` method from an instance of the `Route` class.

```ts
const route = new Route()
route.head('/', () => {})
```

Adding a macro is same as writing the following code in JavaScript.

```ts
Route.prototype.head = function () {
}
```

## Getters
Getters are added to the class prototype using the `Object.defineProperty`. The implementation of a getter is always a function.

```ts
Route.getter('version', function () {
  return 'v1'
})
```

And now access the version as follows.

```ts
const route = new Route()
route.version // v1
```

Adding a getter is same as writing the following code in JavaScript.

```ts
Object.defineProperty(Route, 'version', {
  get() {
    return 'v1'
  },
  configurable: false,
  enumerable: false,
})
```

## Singleton getters
Singleton getters are also defined on the class prototype. However, their values are cached after the first access.

```ts
const singleton = true

Mysql.getter('version', function () {
  return this.config.driver.split('-')[1]
}, singleton)
```

Adding a singleton getter is same as writing the following code in JavaScript.

```ts
Object.defineProperty(Mysql, 'version', {
  get() {
    const value = this.config.driver.split('-')[1]

    // Cache value on the class instance
    Object.defineProperty(this, 'version', {
      configurable: false,
      enumerable: false,
      value: value,
      writable: false,
    })

    return value
  },
  configurable: false,
  enumerable: false,
})
```

## TypeScript types
You will have to use [module augmentation](https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation) in order to define the types for the dynamically added properties.

[gh-workflow-image]: https://img.shields.io/github/workflow/status/poppinss/macroable/test?style=for-the-badge
[gh-workflow-url]: https://github.com/poppinss/macroable/actions/workflows/test.yml "Github action"

[typescript-image]: https://img.shields.io/badge/Typescript-294E80.svg?style=for-the-badge&logo=typescript
[typescript-url]: "typescript"

[npm-image]: https://img.shields.io/npm/v/macroable.svg?style=for-the-badge&logo=npm
[npm-url]: https://npmjs.org/package/macroable 'npm'

[license-image]: https://img.shields.io/npm/l/macroable?color=blueviolet&style=for-the-badge
[license-url]: LICENSE.md 'license'

[synk-image]: https://img.shields.io/snyk/vulnerabilities/github/poppinss/manager?label=Synk%20Vulnerabilities&style=for-the-badge
[synk-url]: https://snyk.io/test/github/poppinss/manager?targetFile=package.json "synk"
