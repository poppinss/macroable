# Macroable

Macroable is a small ES6 class that can be extended to add functionality of macros and getters to your own class. 

It is helpful if you want to expose an API to get your classes extended. 

> This library is used by AdonisJs to offer extend interface for core class.

## Installation
As always, pull it from `npm`.

```bash
npm i --save macroable
```

## Usage

```js
const Macroable = require('macroable')

class User extends Macroable {

}

// it's required to define empty objects for macros and getters.
User._macros = {}
User._getters = {}
```

<br >

---

<br >


Once your class extends `Macroable` class, it get's a bunch of static methods to define **macros** and **getters**.

## Using Macros

```js
User.macro('getUsers', function () {
  // do some work
})
```

and now you can use the **method** from the class instance.

```js
const user = new User()
user.getUsers()
```

<br >

---

<br >

## Using Getters
Getters are values evaluated everytime someone access them.

```js
User.getter('username', function () {
	// return username
})
```

and now you can use the **property** from the class instance

```js
const user = new User()
user.username
```

<br >

---

<br >

## Singleton Getters

Calling the getter callback everytime may be unrequired, since you do not want to re-compute the values. A **singleton** getter can also be defined.

```js
User.getter('username', function () {
	// I am only called once
}, true)
```

```js
const user = new User()

user.username // invokes callback and caches value
user.username // returns from cache
```

<br >

---

<br >

## Hydrating Class
If for some reason you want to remove all getters and macros, you can call the `hydrate` method.

```js
User.macro('getUsers', callback)

User.hasMacro('getUsers') // true

User.hydrate()

User.hasMacro('getUsers') // false
```

<br >

---

<br >

## Checking Existence

You can also find whether a **getter** or **macro** already exists or not.

```js
User.hasMacro('getUsers')
User.hasGetter('username')
```
