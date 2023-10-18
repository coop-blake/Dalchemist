import { BehaviorSubject, Observable, Subscription } from "rxjs";

import { Google } from "../../Google/google";

export class Inventory {
  private entries = new Map<string, InventoryEntry>();
  private state = new State();
  //Google Provider
  private google: Google | null = null;
  private googleLoadedSubscription: Subscription;
  public getStatus(): Status {
    const status = this.state.status;
    return status;
  }
  public getState(): State {
    return this.state;
  }
  public getEntries(): Map<string, InventoryEntry> {
    return this.entries;
  }

  constructor() {
    this.googleLoadedSubscription = Google.getLoaded().subscribe(
      (loaded: string[]) => {
        console.log(
          "🧩Inventory Resource Has Gotten Loaded Event From 🏭Google Provider:",
          loaded
        );

        if (this.google === null && loaded.length > 0) {
          this.google = Google.getInstanceFor(loaded[0]);
          this.state.status = Status.Loading;
          this.refresh();
        } else {
          this.state.status = Status.Unavailable;
        }
      }
    );
  }

  refresh() {}
}

export enum Status {
  Initializing = "Initializing",
  Loading = "Loading",
  Available = "Available",
  Unavailable = "Unavailable"
}

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

export type InventoryEntry = {
  ScanCode: string;
  DefaultSupplier: string;
  Department: string;
  Brand: string;
  Name: string;
  Size: string;
  ReceiptAlias: string;
  BasePrice: string;
  LastCost: string;
  AverageCost: string;
  SubDepartment: string;
  IdealMargin: string;
  Quantity: string;
  Unit: string;
  SupplierUnitID: string;
  N: string;
  S: string;
  NorthLSD: string;
  SouthLSD: string;
  valuesArray: Array<string>;
};
