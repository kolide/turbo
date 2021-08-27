import { Adapter } from "./adapter"
import { ProgressBar } from "../drive/progress_bar"
import { SystemStatusCode, Visit, VisitOptions } from "../drive/visit"
import { FormSubmission } from "../drive/form_submission"
import { Session } from "../session"
import { uuid } from "../../util"

export class BrowserAdapter implements Adapter {
  readonly session: Session
  readonly progressBar = new ProgressBar

  progressBarTimeout?: number

  constructor(session: Session) {
    this.session = session
  }

  visitProposedToLocation(location: URL, options?: Partial<VisitOptions>) {
    this.navigator.startVisit(location, uuid(), options)
  }

  visitStarted(visit: Visit) {
    visit.issueRequest()
    visit.changeHistory()
    visit.goToSamePageAnchor()
    visit.loadCachedSnapshot()
  }

  visitRequestStarted(visit: Visit) {
    console.log("in visitRequestStarted")
    this.progressBar.setValue(0)
    console.log("in visitRequestStarted this.progressBar.setValue(0)")
    if (visit.hasCachedSnapshot() || visit.action != "restore") {
      console.log("in visitRequestStarted this.showProgressBarAfterDelay()")
      this.showProgressBarAfterDelay()
    } else {
      console.log("in visitRequestStarted this.showProgressBar()")
      this.showProgressBar()
    }
  }

  visitRequestCompleted(visit: Visit) {
    visit.loadResponse()
  }

  visitRequestFailedWithStatusCode(visit: Visit, statusCode: number) {
    switch (statusCode) {
      case SystemStatusCode.networkFailure:
      case SystemStatusCode.timeoutFailure:
      case SystemStatusCode.contentTypeMismatch:
        return this.reload()
      default:
        return visit.loadResponse()
    }
  }

  visitRequestFinished(visit: Visit) {
    this.progressBar.setValue(1)
    this.hideProgressBar()
  }

  visitCompleted(visit: Visit) {

  }

  pageInvalidated() {
    this.reload()
  }

  visitFailed(visit: Visit) {

  }

  visitRendered(visit: Visit) {

  }

  formSubmissionStarted(formSubmission: FormSubmission) {
    console.log("in formSubmissionStarted")
    this.progressBar.setValue(0)
    console.log("in formSubmissionStarted this.progressBar.setValue(0)")
    this.showProgressBarAfterDelay()
    console.log("in formSubmissionStarted this.showProgressBarAfterDelay()")
  }

  formSubmissionFinished(formSubmission: FormSubmission) {
    console.log("in formSubmissionFinished")
    this.progressBar.setValue(1)
    console.log("in formSubmissionFinished - this.progressBar.setValue(1)")
    this.hideProgressBar()
    console.log("in formSubmissionFinished - this.hideProgressBar()")

    // setTimeout(()=>{
    //   this.progressBar.setValue(1)
    //   this.hideProgressBar()
    //   console.log("in formSubmissionFinished - this.hideProgressBar() setTimeout 1000")
    // }, 1000)
  }

  // Private

  showProgressBarAfterDelay() {
    console.log("in showProgressBarAfterDelay")
    if (this.progressBarTimeout != null) {
      console.log("in showProgressBarAfterDelay setting timeout", this.session.progressBarDelay)
      this.progressBarTimeout = window.setTimeout(this.showProgressBar, this.session.progressBarDelay)
    }
  }

  showProgressBar = () => {
    console.log("in showProgressBar")
    this.progressBar.show()
  }

  hideProgressBar() {
    this.progressBar.hide()
    if (this.progressBarTimeout != null) {
      console.log("we have a timeout")
      window.clearTimeout(this.progressBarTimeout)
      delete this.progressBarTimeout
    }
  }

  reload() {
    window.location.reload()
  }

  get navigator() {
    return this.session.navigator
  }
}
