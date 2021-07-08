export type Intercept = (callback: () => Promise<any>) => void

export class Interception {
  started = false
  readonly completed: Promise<any>
  readonly intercept: Intercept
  private resolve?: (value: any) => void

  constructor () {
    this.completed = new Promise((resolve) => this.resolve = resolve)
    this.intercept = async (callback) => {
      this.start()
      const value = await callback()
      this.complete(value)
    }
  }

  start () {
    this.started = true
  }

  complete (value: any) {
    this.resolve!(value)
  }
}
