import { BehaviorSubject, Observable } from "rxjs";

export class Inventory {
  private entries = new Map<string, InventoryEntry>();
  private state = new State();
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
    this.state.status = Status.Available;
  }
}

export enum Status {
  Initializing = "Initializing",
  Loading = "Loading",
  Available = "Available",
  Unavailable = "Unavailable"
}

export class State {
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
