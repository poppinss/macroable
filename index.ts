/*
 * @poppinss/macroable
 *
 * (c) Poppinss
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * Adds capabilities for extending the class from outside-in, in the form
 * of macros and getters.
 */
export default abstract class Macroable {
  protected static instanceMacros: Set<{ key: string | symbol | number; value: unknown }> =
    new Set()

  /**
   *
   * Macros are standard properties that gets added to the class prototype.
   *
   * ```ts
   * MyClass.macro('foo', 'bar')
   * ```
   */
  static macro<T extends { new (...args: any[]): any }, K extends keyof InstanceType<T>>(
    this: T,
    name: K,
    value: InstanceType<T>[K]
  ): void {
    this.prototype[name] = value
  }

  static instanceProperty<T extends { new (...args: any[]): any }, K extends keyof InstanceType<T>>(
    this: T,
    name: K,
    value: InstanceType<T>[K]
  ): void {
    const self = this as unknown as typeof Macroable

    if (!self.hasOwnProperty('instanceMacros')) {
      const inheritedProperties: Set<any> = self.instanceMacros
      Object.defineProperty(self, 'instanceMacros', {
        value: new Set(inheritedProperties),
        configurable: true,
        enumerable: true,
        writable: true,
      })
    }

    self.instanceMacros.add({ key: name, value })
  }

  /**
   *
   * Getters are added to the class prototype using the Object.defineProperty.
   *
   * ```ts
   * MyClass.getter('foo', function foo () {
   *   return 'bar'
   * })
   * ```
   *
   * You can add a singleton getter by enabling the `singleton` flag.
   *
   * ```ts
   * const singleton = true
   *
   * MyClass.getter('foo', function foo () {
   *   return 'bar'
   * }, singleton)
   * ```
   */
  static getter<T extends { new (...args: any[]): any }, K extends keyof InstanceType<T>>(
    this: T,
    name: K,
    accumulator: () => InstanceType<T>[K],
    singleton: boolean = false
  ): void {
    Object.defineProperty(this.prototype, name, {
      get() {
        const value = accumulator.call(this)

        if (singleton) {
          Object.defineProperty(this, name, {
            configurable: false,
            enumerable: false,
            value: value,
            writable: false,
          })
        }

        return value
      },
      configurable: true,
      enumerable: false,
    })
  }

  constructor() {
    const self = this as any
    const Constructor = this.constructor as typeof Macroable
    Constructor.instanceMacros.forEach(({ key, value }) => {
      self[key] = typeof value === 'function' ? value.bind(this) : value
    })
  }
}
