/*
 * @poppinss/macroable
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * Shape of the Macro function
 */
type MacroFn<T, Args extends any[], ReturnValue extends any> = (
  this: T,
  ...args: Args
) => ReturnValue

/**
 * Shape of the Getter function
 */
type GetterFn<T, ReturnValue extends any> = (this: T) => ReturnValue

/**
 * Returns the typed variation of the macro by inspecting the
 * interface declaration
 */
type GetMacroFn<T, K> = K extends keyof T
  ? T[K] extends (...args: infer A) => infer B
    ? MacroFn<T, A, B>
    : MacroFn<T, any[], any>
  : MacroFn<T, any[], any>

/**
 * Returns the typed variation of the getter by inspecting the
 * interface declaration
 */
type GetGetterFn<T, K> = K extends keyof T ? GetterFn<T, T[K]> : GetterFn<T, any>

/**
 * Shape of the macroable constructor
 */
export interface MacroableConstructorContract<T extends any> {
  macro<K extends string>(name: K, callback: GetMacroFn<T, K>): void
  getter<K extends string>(name: K, callback: GetGetterFn<T, K>, singleton?: boolean): void
  hydrate(): void
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
  protected static macros: { [key: string]: MacroFn<any, any[], any> }
  protected static getters: { [key: string]: GetterFn<any, any> }

  constructor(..._: any[]) {
    if (!this.constructor['macros'] || !this.constructor['getters']) {
      throw new Error(
        'Set static properties "macros = {}" and "getters = {}" on the class for the macroable to work.'
      )
    }
  }

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
  public static macro<T extends typeof Macroable, K extends string>(
    this: T,
    name: string,
    callback: GetMacroFn<InstanceType<T>, K>
  ) {
    this.macros[name] = callback
    this.prototype[name] = callback
  }

  /**
   * Return the existing macro or null if it doesn't exists
   */
  public static getMacro(name: string): MacroFn<any, any[], any> | undefined {
    return this.macros[name]
  }

  /**
   * Returns a boolean telling if a macro exists
   */
  public static hasMacro(name: string): boolean {
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
  public static getter<T extends typeof Macroable, K extends string>(
    this: T,
    name: string,
    callback: GetGetterFn<InstanceType<T>, K>,
    singleton: boolean = false
  ) {
    const wrappedCallback = singleton
      ? function wrappedCallback() {
          const value = callback.bind(this)()
          Object.defineProperty(this, name, { value, configurable: true })
          return value
        }
      : callback

    this.getters[name] = wrappedCallback

    Object.defineProperty(this.prototype, name, {
      get: wrappedCallback,
      configurable: true,
      enumerable: true,
    })
  }

  /**
   * Return the existing getter or null if it doesn't exists
   */
  public static getGetter(name: string): GetterFn<any, any> | undefined {
    return this.getters[name]
  }

  /**
   * Returns a boolean telling if a getter exists
   */
  public static hasGetter(name: string): boolean {
    return !!this.getGetter(name)
  }

  /**
   * Cleanup getters and macros from the class
   */
  public static hydrate() {
    Object.keys(this.macros).forEach((key) => Reflect.deleteProperty(this.prototype, key))
    Object.keys(this.getters).forEach((key) => Reflect.deleteProperty(this.prototype, key))
    this.macros = {}
    this.getters = {}
  }
}
