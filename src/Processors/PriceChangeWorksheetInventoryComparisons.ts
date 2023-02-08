import process from "node:process";

import PriceChangeWorksheetImporter, {
  PriceChangeWorksheetEntry,
} from "../TextImporters/PriceChangeWorksheet";
import InventoryTextImporter, {
  InventoryEntry,
} from "../TextImporters/Inventory";
import PriceChangeWorksheetsImporter from "../TextImporters/PriceChangeWorksheets";

class PriceChangeWorksheetInventoryComparison {
  InventoryImport = new InventoryTextImporter();
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
    await this.InventoryImport.start();

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
            inventoryEntry: this.InventoryImport.getEntryFromScanCode(
              entry.scanCode
            ),
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

        //if more then one worksheet entry, check price consitency
        if (Object.keys(item.worksheetEntries).length > 1) {
          //add to itemsOnMultipleSheets Object
          this.itemsOnMultipleSheets.push(entry.scanCode.toString());

          //map worksheet entries and check prices on all worksheets match
          const worksheetConsitencyCheck =
            this.areMultipleWorksheetPricesConsitent(
              Object.entries(item.worksheetEntries).map((worksheetEntry) => {
                return worksheetEntry[1];
              })
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
        returnText += `     ${item.inventoryEntry.brand} ${item.inventoryEntry.name}  ${item.inventoryEntry.size}\n`;
        returnText += `     ${item.inventoryEntry.basePrice} Base Price \n`;

        const worksheetEntries = item.worksheetEntries;

        Object.entries(worksheetEntries).forEach((worksheetEntryObject) => {
          const worksheetEntry = worksheetEntryObject[1];
          returnText += `     ${worksheetEntry.modifiedPrice} ${worksheetEntry.worksheetName} \n`;
        });
      }
    });
    return returnText;
  }

  getOutput() {
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

type ItemEntry = {
  worksheetEntries: Map<string, WorkSheetEntry>;
  inventoryEntry: InventoryEntry | undefined;
};

type WorkSheetEntry = {
  priceChangeWorksheetEntry: PriceChangeWorksheetEntry;
  salePriceVsBasePrice: string;
};

export default PriceChangeWorksheetInventoryComparison;
