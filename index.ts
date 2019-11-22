/*
 * macroable
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

type MacroableFn = (...args: any[]) => any
type MacroableMap = { [key: string]: MacroableFn }

export interface MacroableConstructorContract {
  macro (name: string, callback: MacroableFn),
  getter (name: string, callback: MacroableFn, singleton?: boolean),
  hydrate (),
}

/**
 * Macroable is an abstract class to add ability to extend your class
 * prototype using better syntax.
 *
 * Macroable has handful of benefits over using traditional `prototype` approach.
 *
 * 1. Methods or properties added dynamically to the class can be removed using `hydrate` method.
 * 2. Can define singleton getters.
 */
export abstract class Macroable {
  protected static _macros: MacroableMap = {}
  protected static _getters: MacroableMap = {}

  /**
   * Add a macro to the class. This method is a better to manually adding
   * to `class.prototype.method`.
   *
   * Also macros added using `Macroable.macro` can be cleared anytime
   *
   * @example
   * ```js
   * Macroable.macro('getUsername', function () {
   *   return 'virk'
   * })
   * ```
   */
  public static macro (name: string, callback: MacroableFn) {
    this._macros[name] = callback
    this.prototype[name] = callback
  }

  /**
   * Return the existing macro or null if it doesn't exists
   */
  public static getMacro (name: string): MacroableFn | undefined {
    return this._macros[name]
  }

  /**
   * Returns a boolean telling if a macro exists
   */
  public static hasMacro (name: string): boolean {
    return !!this.getMacro(name)
  }

  /**
   * Define a getter, which is invoked everytime the value is accessed. This method
   * also allows adding single getters, whose value is cached after first time
   *
   * @example
   * ```js
   * Macroable.getter('time', function () {
   *   return new Date().getTime()
   * })
   *
   * console.log(new Macroable().time)
   *
   * // Singletons
   * Macroable.getter('time', function () {
   *   return new Date().getTime()
   * }, true)
   *
   * console.log(new Macroable().time)
   * ```
   */
  public static getter (name: string, callback: MacroableFn, singleton: boolean = false) {
    const wrappedCallback = singleton ? function wrappedCallback () {
      const propName = `_${name}_`
      this[propName] = this[propName] || callback.bind(this)()
      return this[propName]
    } : callback

    this._getters[name] = wrappedCallback

    Object.defineProperty(this.prototype, name, {
      get: wrappedCallback,
      configurable: true,
      enumerable: true,
    })
  }

  /**
   * Return the existing getter or null if it doesn't exists
   */
  public static getGetter (name: string): MacroableFn | undefined {
    return this._getters[name]
  }

  /**
   * Returns a boolean telling if a getter exists
   */
  public static hasGetter (name: string): boolean {
    return !!this.getGetter(name)
  }

  /**
   * Cleanup getters and macros from the class
   */
  public static hydrate () {
    Object.keys(this._macros).forEach((key) => Reflect.deleteProperty(this.prototype, key))
    Object.keys(this._getters).forEach((key) => Reflect.deleteProperty(this.prototype, key))
    this._macros = {}
    this._getters = {}
  }
}
