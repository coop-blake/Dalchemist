import { Google } from "../google";
import Settings from "../../electron/Settings";
import * as fs from "fs";

export class Inventory {
  private static instance: Inventory;

  private status: InventoryStatus = InventoryStatus.Starting;
  private lastRefreshCompleted: number = 0;

  private spreadsheetId = "1HdBg3Ht1ALFTBkCXK1YA1cx0vZ9hPx8Ji9m0qy3YMnA"; //acitive id

  //  const spreadsheetId = "1aMcYYPwlH1sllW_DxUWVS-lT0t0QWwTTO3pm7WY4UJk"; //dev id

  private constructor() {
    this.refresh();
  }

  public async refresh() {
    const googleCertPath = (await Settings.loadJsonLocation()) as string;
    if (!googleCertPath) {
      console.log("No googleCertPath!");
      this.status = InventoryStatus.NoCertificate;
      return;
    }

    if (!fs.existsSync(googleCertPath)) {
      console.log("Not Valid googleCertPath!");
      this.status = InventoryStatus.NoCertificate;
      return;
    }

    const sheets = Google.getSheetsFor(googleCertPath);
    const newItemsResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: this.spreadsheetId,
      range: `New Items!A3:Y300`, // Adjust range as needed
    });

    const newItems = newItemsResponse.data.values;
    console.log(newItems);

    this.status = InventoryStatus.Successful;
    this.lastRefreshCompleted = Date.now();
  }

  public getStatus(): string {
    return "no";
  }

  static getInstance(): Inventory {
    if (!Inventory.instance) {
      Inventory.instance = new Inventory();
    }
    return Inventory.instance;
  }
}

enum InventoryStatus {
  NoCertificate,
  Starting,
  Successful,
}
