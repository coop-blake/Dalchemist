import { BehaviorSubject, Observable } from "rxjs";
import { Status } from "./shared";
export class State {
  //Status
  private statusSubject = new BehaviorSubject<Status>(Status.Initializing);
  public get status$(): Observable<Status> {
    return this.statusSubject.asObservable();
  }
  public get status(): Status {
    return this.statusSubject.getValue() as Status;
  }
  public set status(status: Status) {
    this.statusSubject.next(status);
  }

  //Last Refresh
  private lastRefreshCompletedSubject = new BehaviorSubject<number>(0);
  public get lastRefreshCompleted$(): Observable<number> {
    return this.lastRefreshCompletedSubject.asObservable();
  }
  public get lastRefreshCompleted(): number {
    return this.lastRefreshCompletedSubject.getValue();
  }
  public set lastRefreshCompleted(time: number) {
    this.lastRefreshCompletedSubject.next(time);
  }
}
