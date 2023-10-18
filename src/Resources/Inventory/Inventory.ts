import { Subscription } from "rxjs";

import { Google } from "../../Google/google";

import {
  InventoryEntry,
  Status,
  inventoryEntryFromSheetValueArray
} from "./shared";

import { State } from "./State";

//This Inventory Resource gets Data from The Google Sheets Source if supplied
//It also can query the

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
    //returns current status
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
          range: `Inventory!A3:S50000` // Adjust range as needed
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
