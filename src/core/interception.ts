export class Interception {
  started = false
  readonly completed: Promise<any>
  private resolve?: (value: any) => void

  constructor () {
    this.completed = new Promise((resolve) => this.resolve = resolve)
  }

  start () {
    this.started = true
  }

  complete (value: any) {
    this.resolve!(value)
  }
}
