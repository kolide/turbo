import { FrameElement } from "../../elements/frame_element"
import { nextAnimationFrame } from "../../util"
import { Renderer } from "../renderer"

export class FrameRenderer extends Renderer<FrameElement> {
  get shouldRender() {
    return true
  }

  async render() {
    return new Promise<void>(resolve => {
      resolve()
    })
      .then(() => {
        nextAnimationFrame()
      })
      .then(() => {
        this.preservingPermanentElements(() => {
          this.loadFrameElement()
        })
        this.scrollFrameIntoView()
      })
      .then(() => {
        nextAnimationFrame()
      })
      .then(() => {
        this.focusFirstAutofocusableElement()
      })
      .then(() => {
        nextAnimationFrame()
      })
      .then(() => {
        this.activateScriptElements()
      })
  }

  loadFrameElement() {
    const destinationRange = document.createRange()
    destinationRange.selectNodeContents(this.currentElement)
    destinationRange.deleteContents()

    const frameElement = this.newElement
    const sourceRange = frameElement.ownerDocument?.createRange()
    if (sourceRange) {
      sourceRange.selectNodeContents(frameElement)
      this.currentElement.appendChild(sourceRange.extractContents())
    }
  }

  scrollFrameIntoView() {
    if (this.currentElement.autoscroll || this.newElement.autoscroll) {
      const element = this.currentElement.firstElementChild
      const block = readScrollLogicalPosition(this.currentElement.getAttribute("data-autoscroll-block"), "end")

      if (element) {
        element.scrollIntoView({ block })
        return true
      }
    }
    return false
  }

  activateScriptElements() {
    for (const inertScriptElement of this.newScriptElements) {
      const activatedScriptElement = this.createScriptElement(inertScriptElement)
      inertScriptElement.replaceWith(activatedScriptElement)
    }
  }

  get newScriptElements() {
    return this.currentElement.querySelectorAll("script")
  }
}

function readScrollLogicalPosition(value: string | null, defaultValue: ScrollLogicalPosition): ScrollLogicalPosition {
  if (value == "end" || value == "start" || value == "center" || value == "nearest") {
    return value
  } else {
    return defaultValue
  }
}
