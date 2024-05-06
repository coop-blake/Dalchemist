import {
  BehaviorSubject,
  Observable,
  Subscription,
  firstValueFrom,
} from "rxjs";
import {
  InventoryEntry,
  InventoryStatus,
  AltIDEntry,
  AltIDEntryFromValueArray,
  PromoEntry,
  PromoEntryFromValueArray,
  SubDepartmentMarginEntry,
  SubDepartmentMarginEntryFromValueArray,
} from "./shared";
import { Promos } from "./Promos";

import { SubDepartmentMargins } from "./SubDepartmentMargins";
import AltIDs from "./AltIDs";
import { Google } from "../google";

import { first } from "rxjs/operators";

export class Inventory {
  private static instance: Inventory;

  entries = new Map<string, InventoryEntry>();
  private inventoryItemsArray: InventoryEntry[] = [];
  private altIDsItemsArray: AltIDEntry[] = [];
  private promoItemsArray: PromoEntry[] = [];
  private subDepartmentMarginsArray: SubDepartmentMarginEntry[] = [];

  static state: InventoryState;

  private loadedSubscription: Subscription; //unwatch in deconstructor
  private googleInstance: Google | null = null;

  private spreadsheetId = "1HdBg3Ht1ALFTBkCXK1YA1cx0vZ9hPx8Ji9m0qy3YMnA"; //acitive id
  //  const spreadsheetId = "1aMcYYPwlH1sllW_DxUWVS-lT0t0QWwTTO3pm7WY4UJk"; //dev id

  private constructor() {
    Inventory.state = new InventoryState();
    Inventory.state.setStatus(InventoryStatus.Starting);

    this.loadedSubscription = Google.getLoaded().subscribe(
      (loaded: string[]) => {
        console.log("Inventory Got Loaded cert!", loaded);

        if (this.googleInstance === null && loaded.length > 0) {
          this.googleInstance = Google.getInstanceFor(loaded[0]);
          this.refresh();
        }
      }
    );
  }

  public async refresh() {
    try {
      Inventory.state.setStatus(InventoryStatus.Running);

      if (this.googleInstance !== null) {
        const sheets = this.googleInstance.getSheets();
        const inventoryItemsResponse = await sheets.spreadsheets.values.get({
          spreadsheetId: this.spreadsheetId,
          range: `Inventory!A3:S50000`, // Adjust range as needed
        });

        this.inventoryItemsArray = inventoryItemsResponse.data.values
          ?.map((newItemData) => entryFromValueArray(newItemData))
          .filter((inventoryEntry) => {
            this.entries.set(inventoryEntry.ScanCode, inventoryEntry);
            return inventoryEntry !== null;
          }) as [InventoryEntry];

        const altIDItemsResponse = await sheets.spreadsheets.values.get({
          spreadsheetId: this.spreadsheetId,
          range: `AltIDs!A2:C5000`, // Adjust range as needed
        });

        this.altIDsItemsArray = altIDItemsResponse.data.values?.map(
          (newItemData) => AltIDEntryFromValueArray(newItemData)
        ) as [AltIDEntry];
        const altIDs = AltIDs.getInstance();
        altIDs.loadAltIDsFrom(this.altIDsItemsArray);

        const promosResponse = await sheets.spreadsheets.values.get({
          spreadsheetId: this.spreadsheetId,
          range: `Promos!A2:F9000`, // Adjust range as needed
        });

        this.promoItemsArray = promosResponse.data.values?.map((newItemData) =>
          PromoEntryFromValueArray(newItemData)
        ) as [PromoEntry];

        const promos = Promos.getInstance();
        promos.loadPromosFrom(this.promoItemsArray);

        const subDepartmentMarginsResponse =
          await sheets.spreadsheets.values.get({
            spreadsheetId: this.spreadsheetId,
            range: `SubDepartmentMargins!A2:B9000`, // Adjust range as needed
          });

        this.subDepartmentMarginsArray =
          subDepartmentMarginsResponse.data.values?.map((newItemData) =>
            SubDepartmentMarginEntryFromValueArray(newItemData)
          ) as [SubDepartmentMarginEntry];

        const subDepartmentMargins = SubDepartmentMargins.getInstance();
        subDepartmentMargins.loadSubDepartmentMarginsFrom(
          this.subDepartmentMarginsArray
        );

        Inventory.state.setLastRefreshCompleted(Date.now());

        setTimeout(() => {
          this.refresh();
        }, 900000);
      }
    } catch (error) {
      console.log(error);
      Inventory.state.setStatus(InventoryStatus.Error);
    }
  }

  getEntryFromScanCode(scanCode: string) {
    const entryToReturn = this.entries.get(scanCode);

    return entryToReturn;
  }

  public getState(): InventoryState {
    return Inventory.state;
  }

  static getInstance(): Inventory {
    if (!Inventory.instance) {
      Inventory.instance = new Inventory();
    }
    return Inventory.instance;
  }
}

export class InventoryState {
  private statusSubject = new BehaviorSubject<InventoryStatus>(
    InventoryStatus.Starting
  );
  private lastRefreshCompletedSubject = new BehaviorSubject<number>(0);

  public get status$(): Observable<InventoryStatus> {
    return this.statusSubject.asObservable();
  }

  public get lastRefreshCompleted$(): Observable<number> {
    return this.lastRefreshCompletedSubject.asObservable();
  }

  public get lastRefreshCompleted(): number {
    return this.lastRefreshCompletedSubject.getValue();
  }

  public setStatus(status: InventoryStatus) {
    this.statusSubject.next(status);
  }

  public setLastRefreshCompleted(time: number) {
    this.lastRefreshCompletedSubject.next(time);
  }

  public async onLoaded(): Promise<number> {
    return firstValueFrom(
      this.lastRefreshCompleted$.pipe(first((value) => value > 0))
    );
  }
}

const entryFromValueArray = function (
  valueArray: Array<string>
): InventoryEntry {
  //Based off of expected Values as outlined in
  // Data/Inputs/README.md
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

    //All values as array as received
    valuesArray: valueArray,
  };
  return entry;
};

function fillArrayWithEmptyStrings(num: number, arr: string[]): string[] {
  if (arr.length >= num) {
    return arr;
  }

  const diff = num - arr.length;
  const emptyStrings = new Array(diff).fill("");

  return [...arr, ...emptyStrings];
}
export { InventoryEntry };
