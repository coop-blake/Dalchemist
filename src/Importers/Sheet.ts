import { InputLines } from "./Base";

import { Google } from "../Google/google";

import { from, firstValueFrom } from "rxjs";
import { filter, take } from "rxjs/operators";

export class SheetInput implements InputLines {
  sheetID: string;
  sheetRange: string;

  private google: Google | null = null;

  constructor(sheetID: string, sheetRange: string) {
    this.sheetID = sheetID;
    this.sheetRange = sheetRange;
  }
  async getLines() {
    try {
      const loaded$ = from(Google.getLoaded());
      const loaded = await firstValueFrom(
        loaded$.pipe(
          filter((loaded) => loaded.length > 0),
          take(1)
        )
      );

      if (this.google === null && loaded[0]) {
        this.google = Google.getInstanceFor(loaded[0]);
      }
      if (this.google !== null) {
        const sheets = this.google.getSheets();
        const inventoryItemsResponse = await sheets.spreadsheets.values.get({
          spreadsheetId: this.sheetID,
          range: this.sheetRange
        });
        return (
          (inventoryItemsResponse.data.values as Array<Array<string>>) ??
          Array<Array<string>>()
        );
      } else {
        return Array<Array<string>>(); // Handle other cases as needed
      }
    } catch (error) {
      console.log(error);
      return Array<Array<string>>(); // Handle errors as needed
    }
  }
}
