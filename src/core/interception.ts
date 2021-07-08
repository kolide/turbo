export type Intercept = (callback: (value: any) => void) => void

export class Interception {
  started = false
  readonly completed: Promise<any>
  readonly intercept: Intercept
  private resolve?: (value: any) => void

  constructor () {
    this.completed = new Promise((resolve) => this.resolve = resolve)
    this.intercept = (callback) => {
      this.start()
      callback(this.complete.bind(this))
    }
  }

  start () {
    this.started = true
  }

  complete (value: any) {
    this.resolve!(value)
  }
}
