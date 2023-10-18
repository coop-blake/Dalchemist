import { BehaviorSubject, Observable, Subscription } from "rxjs";

import { Google } from "../../Google/google";

import { fillArrayWithEmptyStrings } from "../../Utility";
export class Inventory {
  private entries = new Map<string, InventoryEntry>();

  private state = new State();
  //Google Provider
  private google: Google | null = null;
  private googleEntries = new Array<InventoryEntry>();
  private googleLoadedSubscription: Subscription;
  private spreadsheetId = "1HdBg3Ht1ALFTBkCXK1YA1cx0vZ9hPx8Ji9m0qy3YMnA"; //acitive id
  //  const spreadsheetId = "1aMcYYPwlH1sllW_DxUWVS-lT0t0QWwTTO3pm7WY4UJk"; //dev id
  //ToDo: Put the configuration details in a Configuration

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
          this.refreshFromGoogle();
        } else {
          this.state.status = Status.Unavailable;
        }
      }
    );
  }

  public async refreshFromGoogle() {
    this.state.status = Status.Loading;
    try {
      if (this.google !== null) {
        const sheets = this.google.getSheets();
        const inventoryItemsResponse = await sheets.spreadsheets.values.get({
          spreadsheetId: this.spreadsheetId,
          range: `Inventory!A3:S50000`, // Adjust range as needed
        });

        this.googleEntries = inventoryItemsResponse.data.values
          ?.map((newItemData) => inventoryEntryFromSheetValueArray(newItemData))
          .filter((inventoryEntry) => {
            this.entries.set(inventoryEntry.ScanCode, inventoryEntry);
            return inventoryEntry !== null;
          }) as [InventoryEntry];

        this.state.lastRefreshCompleted = Date.now();
        this.state.status = Status.Available;
      }
    } catch (error) {
      console.log(error);
      this.state.status = Status.Error;
    }
  }
}

export enum Status {
  Initializing = "Initializing",
  Loading = "Loading",
  Available = "Available",
  Unavailable = "Unavailable",
  Error = "Unexpected Error",
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
};

export const inventoryEntryFromSheetValueArray = function (
  valueArray: Array<string>
): InventoryEntry {
  if (valueArray.length !== 19) {
    valueArray = fillArrayWithEmptyStrings(19, valueArray);
  }
  const entry: InventoryEntry = {
    ScanCode: valueArray[0].trim(),
    DefaultSupplier: valueArray[1].trim(),
    Department: valueArray[2].trim(),
    Brand: valueArray[3].trim(),
    Name: valueArray[4].trim(),
    Size: valueArray[5].trim(),
    ReceiptAlias: valueArray[6].trim(),
    BasePrice: valueArray[7].trim(),
    LastCost: valueArray[8].trim(),
    AverageCost: valueArray[9].trim(),
    SubDepartment: valueArray[10].trim(),
    IdealMargin: valueArray[11].trim(),
    Quantity: valueArray[12].trim(),
    Unit: valueArray[13].trim(),
    SupplierUnitID: valueArray[14].trim(),
    N: valueArray[15].trim(),
    S: valueArray[16].trim(),
    NorthLSD: valueArray[17].trim(),
    SouthLSD: valueArray[18].trim(),
  };
  return entry;
};
