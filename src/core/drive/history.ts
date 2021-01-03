import { Location } from "../location"
import { Position } from "../types"
import { nextMicrotask, uuid } from "../../util"

export interface HistoryDelegate {
  historyPoppedToLocationWithRestorationIdentifier(location: Location, restorationIdentifier: string): void
}

type HistoryMethod = (this: typeof history, state: any, title: string, url?: string | null | undefined) => void

export type RestorationData = { scrollPosition?: Position }

export type RestorationDataMap = { [restorationIdentifier: string]: RestorationData }

export class History {
  readonly delegate: HistoryDelegate
  location!: Location
  initialLocation?: Location
  restorationIdentifier = uuid()
  initialRestorationIdentifier?: string
  restorationData: RestorationDataMap = {}
  started = false
  pageLoaded = false
  previousScrollRestoration?: ScrollRestoration

  constructor(delegate: HistoryDelegate) {
    this.delegate = delegate
  }

  start() {
    if (!this.started) {
      this.previousScrollRestoration = history.scrollRestoration
      history.scrollRestoration = "manual"
      addEventListener("popstate", this.onPopState, false)
      addEventListener("load", this.onPageLoad, false)
      this.initialLocation = Location.currentLocation
      this.initialRestorationIdentifier = this.restorationIdentifier
      this.started = true
    }
  }

  stop() {
    if (this.started) {
      history.scrollRestoration = this.previousScrollRestoration ?? "auto"
      removeEventListener("popstate", this.onPopState, false)
      removeEventListener("load", this.onPageLoad, false)
      delete this.initialLocation
      delete this.initialRestorationIdentifier
      this.started = false
    }
  }

  push(location: Location, restorationIdentifier?: string) {
    this.update(history.pushState, location, restorationIdentifier)
  }

  replace(location: Location, restorationIdentifier?: string) {
    this.update(history.replaceState, location, restorationIdentifier)
  }

  update(method: HistoryMethod, location: Location, restorationIdentifier = uuid()) {
    const state = { turbo: { restorationIdentifier } }
    method.call(history, state, "", location.absoluteURL)
    this.location = location
    this.restorationIdentifier = restorationIdentifier
  }

  // Restoration data

  getRestorationDataForIdentifier(restorationIdentifier: string): RestorationData {
    return this.restorationData[restorationIdentifier] || {}
  }

  updateRestorationData(additionalData: Partial<RestorationData>) {
    const { restorationIdentifier } = this
    const restorationData = this.restorationData[restorationIdentifier]
    this.restorationData[restorationIdentifier] = { ...restorationData, ...additionalData }
  }

  // Event handlers

  onPopState = (event: PopStateEvent) => {
    if (this.shouldHandlePopState()) {
      const restorationIdentifier = this.restorationIdentifierForPopState(event)
      if (!restorationIdentifier) return
      this.restorationIdentifier = restorationIdentifier
      this.delegate.historyPoppedToLocationWithRestorationIdentifier(Location.currentLocation, restorationIdentifier)
    }
  }

  onPageLoad = async (event: Event) => {
    await nextMicrotask()
    this.pageLoaded = true
  }

  // Private

  shouldHandlePopState() {
    // Safari dispatches a popstate event after window's load event, ignore it
    return this.pageIsLoaded()
  }

  pageIsLoaded() {
    return this.pageLoaded || document.readyState == "complete"
  }

  restorationIdentifierForPopState(event: PopStateEvent) {
    if (event.state) {
      return (event.state.turbo || {}).restorationIdentifier
    }

    if (this.poppedToInitialEntry(event)) {
      return this.initialRestorationIdentifier
    }
  }

  poppedToInitialEntry(event: PopStateEvent) {
    return !event.state && Location.currentLocation.isEqualTo(this.initialLocation)
  }
}
