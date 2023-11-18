import { BehaviorSubject, Observable, Subscription } from "rxjs";

import { Google } from "../google";

import { AttributeChangeEntry, NewItemEntry, AddDropStatus } from "./shared";

import { Inventory } from "../Inventory/Inventory";
import { InventoryEntry } from "../Inventory/shared";

export class AddDrop {
  private static instance: AddDrop;
  static state: AddDropState;

  private loadedSubscription: Subscription; //unwatch in deconstructor
  private lastRefreshCompletedSubscription: Subscription;
  private spreadsheetId = "1RprheRwf1bysnNYk9jGg1zPiA4DoiGMMe74j9nVP_hU"; //document id of "Copy of add drop for API Dev"
  private googleInstance: Google | null = null;

  private constructor() {
    Inventory.getInstance();
    AddDrop.state = new AddDropState();
    AddDrop.state.setStatus(AddDropStatus.Starting);

    this.loadedSubscription = Google.getLoaded().subscribe(
      (loaded: string[]) => {
        console.log("Add Drop Got Loaded cert!", loaded);

        if (this.googleInstance === null && loaded.length > 0) {
          this.googleInstance = Google.getInstanceFor(loaded[0]);
          this.refresh();
        }
      }
    );

    this.lastRefreshCompletedSubscription =
      Inventory.state.lastRefreshCompleted$.subscribe(
        (lastRefreshCompleted: number) => {
          if (lastRefreshCompleted !== 0) {
            const lastRefreshDate = new Date(lastRefreshCompleted);
            const formattedDate = lastRefreshDate.toLocaleString(undefined, {
              year: "numeric",
              month: "numeric",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            });
            console.log(`Inventory Updated changed: ${formattedDate}`);
            this.refresh();
          }
        }
      );
  }

  public async refresh() {
    try {
      if (this.googleInstance !== null) {
        const sheets = this.googleInstance.getSheets();
        // const drive = this.googleInstance.getDrive();
        AddDrop.state.setStatus(AddDropStatus.Running);

        //Read data from New Items Tab
        const newItemsResponse = await sheets.spreadsheets.values.get({
          spreadsheetId: this.spreadsheetId,
          range: `New Items!A3:Y300`, // Adjust range as needed
        });

        const newItems = newItemsResponse.data.values
          ?.map((newItemData) => newItemEntryFromValueArray(newItemData))
          .filter((newItemData) => {
            return newItemData !== null;
          }) as [NewItemEntry];
        AddDrop.state.setNewItems(newItems ?? []);

        const itemsAlreadyInInventory = newItems
          ?.map((newItem) => {
            const inventoryItem = Inventory.getInstance().getEntryFromScanCode(
              newItem?.ScanCode ? newItem?.ScanCode : ""
            );
            return inventoryItem === undefined
              ? null
              : [newItem, inventoryItem];
          })
          .filter((newItemData) => {
            return newItemData;
          }) as [[NewItemEntry, InventoryEntry]];
        AddDrop.state.setItemsAlreadyInInventory(itemsAlreadyInInventory ?? []);

        /*###################################################################################
# Process Attribute Updates
#####################################################################################*/
        // Read data from "Price and attribute changes" tab
        // Main.statusMessageUpdate("Reading Price and Attribute Changes");

        const attributeChangesResponse = await sheets.spreadsheets.values.get({
          spreadsheetId: this.spreadsheetId,
          range: `Price & Attribute Changes!A3:AC300`, // Adjust range as needed
        });
        const attributeChangeItems = attributeChangesResponse.data.values
          ?.map((attributeChangeItem) =>
            attributeChangeEntryFromValueArray(
              fillArrayWithEmptyStrings(29, attributeChangeItem)
            )
          )
          .filter((attributeChangeItem) => {
            return attributeChangeItem;
          }) as [AttributeChangeEntry];

        AddDrop.state.setAttributeChangeItems(attributeChangeItems ?? []);
        //If attributeChange contains a price update - put it in an array
        const priceUpdates = attributeChangeItems?.filter((attributeChange) => {
          return (
            containsAny(attributeChange?.ChangeOne ?? "", [
              "Price & Cost Change",
              "Price Change Only",
              "Cost Change Only",
            ]) ||
            containsAny(attributeChange?.ChangeTwo ?? "", [
              "Price & Cost Change",
              "Price Change Only",
              "Cost Change Only",
            ]) ||
            containsAny(attributeChange?.ChangeThree ?? "", [
              "Price & Cost Change",
              "Price Change Only",
              "Cost Change Only",
            ]) ||
            containsAny(attributeChange?.ChangeFour ?? "", [
              "Price & Cost Change",
              "Price Change Only",
              "Cost Change Only",
            ])
          );
        }) as [AttributeChangeEntry];

        AddDrop.state.setPriceUpdates(priceUpdates ?? []);
        AddDrop.state.setLastRefreshCompleted(Date.now());

        setTimeout(() => {
          this.refresh();
        }, 100000);
      }
    } catch (error) {
      console.error(error);
    }
  }

  static getInstance(): AddDrop {
    if (!AddDrop.instance) {
      AddDrop.instance = new AddDrop();
    }
    return AddDrop.instance;
  }
  //End of AddDrop Class
}

export class AddDropState {
  private statusSubject = new BehaviorSubject<AddDropStatus>(
    AddDropStatus.Starting
  );
  private lastRefreshCompletedSubject = new BehaviorSubject<number>(0);

  private newItemsSubject = new BehaviorSubject<NewItemEntry[]>([]);
  private itemsAlreadyInInventorySubject = new BehaviorSubject<
    [NewItemEntry, InventoryEntry][]
  >([]);
  private attributeChangeItemsSubject = new BehaviorSubject<
    AttributeChangeEntry[]
  >([]);
  private priceUpdatesSubject = new BehaviorSubject<AttributeChangeEntry[]>([]);

  public get status$(): Observable<AddDropStatus> {
    return this.statusSubject.asObservable();
  }
  public setStatus(status: AddDropStatus) {
    this.statusSubject.next(status);
  }
  public get status(): AddDropStatus {
    return this.statusSubject.getValue();
  }

  public get lastRefreshCompleted$(): Observable<number> {
    return this.lastRefreshCompletedSubject.asObservable();
  }
  public setLastRefreshCompleted(time: number) {
    this.lastRefreshCompletedSubject.next(time);
  }
  public get lastRefreshCompleted(): number {
    return this.lastRefreshCompletedSubject.getValue();
  }

  public get newItems(): NewItemEntry[] {
    return this.newItemsSubject.getValue();
  }
  public get newItems$(): Observable<NewItemEntry[]> {
    return this.newItemsSubject.asObservable();
  }
  public setNewItems(newItems: NewItemEntry[]) {
    this.newItemsSubject.next(newItems);
  }

  public get itemsAlreadyInInventory(): [NewItemEntry, InventoryEntry][] {
    return this.itemsAlreadyInInventorySubject.getValue();
  }
  public get itemsAlreadyInInventory$(): Observable<
    [NewItemEntry, InventoryEntry][]
  > {
    return this.itemsAlreadyInInventorySubject.asObservable();
  }
  public setItemsAlreadyInInventory(
    itemsAlreadyInInventory: [NewItemEntry, InventoryEntry][]
  ) {
    this.itemsAlreadyInInventorySubject.next(itemsAlreadyInInventory);
  }

  public get attributeChangeItems(): AttributeChangeEntry[] {
    return this.attributeChangeItemsSubject.getValue();
  }
  public get attributeChangeItems$(): Observable<AttributeChangeEntry[]> {
    return this.attributeChangeItemsSubject.asObservable();
  }
  public setAttributeChangeItems(attributeChangeItems: AttributeChangeEntry[]) {
    this.attributeChangeItemsSubject.next(attributeChangeItems);
  }

  public get priceUpdates(): AttributeChangeEntry[] {
    return this.priceUpdatesSubject.getValue();
  }
  public get priceUpdates$(): Observable<AttributeChangeEntry[]> {
    return this.priceUpdatesSubject.asObservable();
  }
  public setPriceUpdates(priceUpdates: AttributeChangeEntry[]) {
    this.priceUpdatesSubject.next(priceUpdates);
  }
}

AddDrop.getInstance();

/*###################################################################################
# Item Types and Return Functions
#####################################################################################*/
export const newItemEntryFromValueArray = function (
  valueArray: Array<string>
): NewItemEntry | null {
  //Based off of expected Values as outlined in
  // Data/Inputs/README.md
  if (valueArray.length === 25) {
    const entry: NewItemEntry = {
      Date: valueArray[0].trim() ?? "",
      Client: valueArray[1].trim() ?? "",
      ScanCode: valueArray[2].trim() ?? "",
      Supplier: valueArray[3].trim() ?? "",
      SupplierItemID: valueArray[4].trim() ?? "",
      Brand: valueArray[5].trim() ?? "",
      Name: valueArray[6].trim() ?? "",
      Unit: valueArray[7].trim() ?? "",
      SubDepartment: valueArray[8].trim() ?? "",
      Quantity: valueArray[9].trim() ?? "",
      CaseCost: valueArray[10].trim() ?? "",
      UnitCost: valueArray[11].trim() ?? "",
      MARGIN: valueArray[12].trim() ?? "",
      ShippingPercent: valueArray[13].trim() ?? "",
      ProposedPrice: valueArray[14].trim() ?? "",
      BasePrice: valueArray[15].trim() ?? "",
      Department: valueArray[16].trim() ?? "",
      BottleDepositFlag: valueArray[17].trim() ?? "",
      LocalDirectFlag: valueArray[18].trim() ?? "",
      LocalSixFlag: valueArray[19].trim() ?? "",
      LocalORFlag: valueArray[20].trim() ?? "",
      OGFlag: valueArray[21].trim() ?? "",
      FlipChartAddFlag: valueArray[22].trim() ?? "",
      Comments: valueArray[23].trim() ?? "",

      //All values as array as receive
      valuesArray: valueArray,
    };
    return entry;
  }

  return null;
};

export const attributeChangeEntryFromValueArray = function (
  valueArray: Array<string>
): AttributeChangeEntry | null {
  //Based off of expected Values as outlined in
  // Data/Inputs/README.md
  if (valueArray.length === 29) {
    const entry: AttributeChangeEntry = {
      Date: valueArray[0].trim() ?? "",
      Client: valueArray[1].trim() ?? "",
      ScanCode: valueArray[2].trim() ?? "",
      Supplier: valueArray[3].trim() ?? "",
      SupplierItemID: valueArray[4].trim() ?? "",
      Brand: valueArray[5].trim() ?? "",
      Name: valueArray[6].trim() ?? "",
      Unit: valueArray[7].trim() ?? "",
      SubDepartment: valueArray[8].trim() ?? "",
      Quantity: valueArray[9].trim() ?? "",
      CaseCost: valueArray[10].trim() ?? "",
      UnitCost: valueArray[11].trim() ?? "",
      MARGIN: valueArray[12].trim() ?? "",
      ShippingPercent: valueArray[13].trim() ?? "",
      ProposedPrice: valueArray[14].trim() ?? "",
      BasePrice: valueArray[15].trim() ?? "",
      Department: valueArray[16].trim() ?? "",
      BottleDepositFlag: valueArray[17].trim() ?? "",
      LocalDirectFlag: valueArray[18].trim() ?? "",
      LocalSixFlag: valueArray[19].trim() ?? "",
      LocalORFlag: valueArray[20].trim() ?? "",
      OGFlag: valueArray[21].trim() ?? "",
      ChangeOne: valueArray[22].trim() ?? "",
      ChangeTwo: valueArray[23].trim() ?? "",
      ChangeThree: valueArray[24].trim() ?? "",
      ChangeFour: valueArray[25].trim() ?? "",
      Comments: valueArray[26].trim() ?? "",
      BestDateForPriceChange: valueArray[27].trim() ?? "",
      BestTimeForPriceChange: valueArray[28].trim() ?? "",

      valuesArray: valueArray,
    };
    return entry;
  }

  return null;
};

/*###################################################################################
# Utility Functions  --  Move to Utility
#####################################################################################*/

function fillArrayWithEmptyStrings(num: number, arr: string[]): string[] {
  if (arr.length >= num) {
    return arr;
  }

  const diff = num - arr.length;
  const emptyStrings = new Array(diff).fill("");

  return [...arr, ...emptyStrings];
}

function containsAny(str: string, substrArray: string[]): boolean {
  return substrArray.some((substring) => str.includes(substring));
}
export { AttributeChangeEntry, NewItemEntry };
