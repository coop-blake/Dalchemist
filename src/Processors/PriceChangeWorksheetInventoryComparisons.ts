/**
 * @module PriceChangeWorksheetInventoryComparison
 * @exports PriceChangeWorksheetInventoryComparison
 * @category Price Checks
 * @internal
 */
import process from "node:process";

import path from "node:path";

import PriceChangeWorksheetImporter, {
  PriceChangeWorksheetEntry,
} from "../TextImporters/PriceChangeWorksheet";
import InventoryImporter, { InventoryEntry } from "../TextImporters/Inventory";
import PriceChangeWorksheetsImporter from "./PriceChangeWorksheets";
/**
 *  PriceChangeWorksheetInventoryComparison
 *
 *  * Imports price change worksheets and inventory data
 *  * compares the sale prices on worksheets against the base prices in the inventory.
 * @class PriceChangeWorksheetInventoryComparison
 *
 *  @example
 * const priceChangeWorksheetInventoryComparisons =
 *   new PriceChangeWorksheetInventoryComparisons();
 * //initialize processor to load price change worksheets
 * priceChangeWorksheetInventoryComparisons
 *   .initialize()
 *   .then(() => {
 *     //get the text ouput for the loaded files
 *     //getOutput looks for arguments to adjust output accordingly
 *     console.log(priceChangeWorksheetInventoryComparisons.getOutput());
 *   })
 *   .catch((error) => {
 *     console.log(error);
 *   });
 *
 *
 */
export class PriceChangeWorksheetInventoryComparison {
  /**
   * Property for the Inventory
   */
  Inventory = new InventoryImporter();
  PriceChangeWorksheetsImporter = new PriceChangeWorksheetsImporter();

  worksheetsByName = new Map<string, PriceChangeWorksheetImporter>();

  items = new Map<string, ItemEntry>();

  itemsOnMultipleSheets = new Array<string>();
  itemsWithDifferentSalePrices = new Array<string>();
  itemsWithHigherSalePrices = new Array<string>();
  itemsWithSameSalePrices = new Array<string>();

  async initialize() {
    //load data into importers
    await this.PriceChangeWorksheetsImporter.initialize();
    await this.Inventory.start();

    //cycle through each price change worksheet
    this.PriceChangeWorksheetsImporter.forEachWorksheet((worksheet) => {
      this.worksheetsByName.set(worksheet.textFilePath, worksheet);

      worksheet.forEachEntry((entry) => {
        //   console.log(entry)
        let item = this.items.get(entry.scanCode.toString());
        let salePriceVsBasePrice = "";
        let worksheetEntries: Map<string, WorkSheetEntry>;
        //first time we have proccessed this item, create empty worksheetEntries

        if (item) {
          worksheetEntries = item.worksheetEntries;
        } else {
          worksheetEntries = new Map<string, WorkSheetEntry>();
          item = {
            worksheetEntries: worksheetEntries,
            inventoryEntry: this.Inventory.getEntryFromScanCode(entry.scanCode),
          };
        }

        if (!item.inventoryEntry) {
          console.log("🌋🌋🌋🌋🌋Shouldn't happen!");
          console.log(`Worksheet ${JSON.stringify(entry)}`);
          console.log(`Worksheet ${JSON.stringify(worksheet)}`);
          console.log("🌋🌋🌋🌋🌋");
        }

        //add worksheet name to entry
        //entry.worksheetName = worksheet.textFilePath.split(`/`).pop();

        //check worksheet against base Price
        if (
          item.inventoryEntry &&
          parseFloat(item.inventoryEntry.basePrice) ==
            parseFloat(entry.modifiedPrice)
        ) {
          salePriceVsBasePrice = "same";
          this.itemsWithSameSalePrices.push(entry.scanCode.toString());
        }
        if (
          item.inventoryEntry &&
          parseFloat(item.inventoryEntry.basePrice) <
            parseFloat(entry.modifiedPrice)
        ) {
          salePriceVsBasePrice = "higher";
          this.itemsWithHigherSalePrices.push(entry.scanCode.toString());
        }
        const worksheetEntry = {
          priceChangeWorksheetEntry: entry,
          salePriceVsBasePrice: salePriceVsBasePrice,
        };
        //add worksheet entry to item worksheetEntries
        item.worksheetEntries.set(worksheet.textFilePath, worksheetEntry);
        //add item to items
        this.items.set(entry.scanCode.toString(), item);
        const worksheetEntriesArrayLength = item.worksheetEntries.size;
        //if more then one worksheet entry, check price consitency
        if (worksheetEntriesArrayLength > 1) {
          //add to itemsOnMultipleSheets Object
          this.itemsOnMultipleSheets.push(entry.scanCode.toString());

          //map worksheet entries and check prices on all worksheets match
          const worksheetConsitencyCheck =
            this.areMultipleWorksheetPricesConsitent(
              Array.from(item.worksheetEntries.values())
            );
          //if prices don't match, add to itemsWithDifferentSalePrices
          if (!worksheetConsitencyCheck) {
            this.itemsWithDifferentSalePrices.push(entry.scanCode.toString());
          }
        }
      });
    });
  }

  areMultipleWorksheetPricesConsitent(worksheetEntries: any[]) {
    //Function checks worksheetEntries array for price consistency
    //returns true or false
    let lastPrice: string | null = null;
    let isConsitent = true;
    worksheetEntries.forEach((entry) => {
      if (
        lastPrice === null ||
        parseFloat(lastPrice) == parseFloat(entry.modifiedPrice)
      ) {
        lastPrice = entry.modifiedPrice;
      } else {
        isConsitent = false;
      }
    });
    return isConsitent;
  }

  getTextInventoryDescriptionAndPrices(items: Array<string>) {
    let returnText = "";
    items.forEach((itemCode) => {
      const item = this.items.get(itemCode);
      if (item !== undefined && item.inventoryEntry) {
        returnText += `------------------------------------------------------------------------------------\n`;
        returnText += `     ${item.inventoryEntry.brand} ${item.inventoryEntry.name}  ${item.inventoryEntry.size}\n`;
        returnText += `     ${item.inventoryEntry.basePrice} Base Price (${item.inventoryEntry.scanCode})\n`;

        const worksheetEntries = item.worksheetEntries;

        worksheetEntries.forEach((worksheetEntry, worksheetPath) => {
          returnText += `     ${
            worksheetEntry.priceChangeWorksheetEntry.modifiedPrice
          } ${path.basename(worksheetPath)} \n`;
        });
      }
    });
    return returnText;
  }
  //   Output changes based on these flags:
  //      --show-multiple-worksheet-items
  //      --show-same-priced-items
  //      --hide-higher-priced-items
  //      --hide-items-with-inconsistent-worksheets

  /**
   * Creates a readable string
   *
   * Output changes based on these flags:
   *    --show-multiple-worksheet-items
   *    --show-same-priced-items
   *    --hide-higher-priced-items
   *    --hide-items-with-inconsistent-worksheets
   *
   * @returns {string} - String for output
   */
  getOutput(): string {
    //Start with blank output
    let outputText = "";

    //Check args and include output based on user input
    if (process.argv.includes("--show-multiple-worksheet-items")) {
      outputText += `👻Multiple Worksheet items👻\n`;
      outputText += this.getTextInventoryDescriptionAndPrices(
        this.itemsOnMultipleSheets
      );
    }

    if (process.argv.includes("--show-same-priced-items")) {
      outputText += `👻 Same priced Items 👻\n`;
      outputText += this.getTextInventoryDescriptionAndPrices(
        this.itemsWithSameSalePrices
      );
    }

    if (!process.argv.includes("--hide-higher-priced-items")) {
      outputText += `🙃Higher Priced Sale Items🙃\n`;
      outputText += this.getTextInventoryDescriptionAndPrices(
        this.itemsWithHigherSalePrices
      );
    }

    if (!process.argv.includes("--hide-items-with-inconsitent-worksheets")) {
      outputText += `🧨Different Sale Prices🧨 \n`;
      outputText += this.getTextInventoryDescriptionAndPrices(
        this.itemsWithDifferentSalePrices
      );
    }

    if (outputText == "") {
      outputText += `No Output shown:
     Accepted Arguments:
    --show-multiple-worksheet-items
    --show-same-priced-items
    --hide-higher-priced-items
    --hide-items-with-inconsitent-worksheets
    `;
    }

    return outputText;
  }
}

/**
 * Represents an item entry that contains information about a worksheet and an inventory entry.
 */
type ItemEntry = {
  /**
   * A map of worksheet entries, where the keys are the names of the worksheets.
   */
  worksheetEntries: Map<string, WorkSheetEntry>;
  /**
   * The inventory entry for the item, if it exists.
   */
  inventoryEntry: InventoryEntry | undefined;
};

/**
 * Represents a worksheet entry for an item.
 */
type WorkSheetEntry = {
  /**
   * The price change worksheet entry for the item.
   */
  priceChangeWorksheetEntry: PriceChangeWorksheetEntry;

  /**
   * The difference between the sale price and the base price of the item.
   */
  salePriceVsBasePrice: string;
};

export default PriceChangeWorksheetInventoryComparison;
