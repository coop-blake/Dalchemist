import { Status } from "./shared";
import { State } from "./State";
import {
  InventorySheetReader,
  InventorySheetEntry,
} from "../../Resources/Inventory/Sheet";

export class Inventory {
  private state = new State();

  private sheetEntriesMap = new Map<string, InventorySheetEntry>();
  private sheetEntriesArray = new Array<InventorySheetEntry>();

  constructor() {
    this.start();
  }
  //Called from constructor
  private async start() {
    await this.load();
  }
  //load inventory sheet
  private async load() {
    try {
      await this.loadSheet();
    } catch (error) {
      //if there is an error, set status to error
      console.log(error);
      this.state.status = Status.Error;
    }
  }

  private async loadSheet() {
    //set status to loading
    this.state.status = Status.Loading;
    //Attempt to read inventory sheet
    this.sheetEntriesArray = await new InventorySheetReader().read();
    //Map the array to a map using ScanCode as the key
    this.sheetEntriesArray.forEach((entry) =>
      this.sheetEntriesMap.set(entry.ScanCode, entry)
    );
    //set status to available and update last refresh time
    this.state.lastRefreshCompleted = Date.now();
    //if there are no entries, set status to unavailable
    this.state.status =
      this.sheetEntriesArray.length > 0 ? Status.Available : Status.Unavailable;
  }

  public getStatus(): Status {
    //returns current status
    const status = this.state.status;
    return status;
  }
  public getState(): State {
    return this.state;
  }
  public getSheetEntriesMap(): Map<string, InventorySheetEntry> {
    return this.sheetEntriesMap;
  }
  public getSheetEntriesArray(): Array<InventorySheetEntry> {
    return this.sheetEntriesArray;
  }
}
