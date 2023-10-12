import { Inventory, InventoryEntry } from "../../Google/Inventory/Inventory";
import path from "path";
import { CoreSets } from "./CoreSets";
import PriceChangeWorksheetsImporter from "../../Processors/PriceChangeWorksheets";
import PriceChangeWorksheetImporter, {
  PriceChangeWorksheetEntry
} from "../../TextImporters/PriceChangeWorksheet";

export const createCoreSupportWithCatapultPricingTSV = async function () {
  const inventoryImporter = Inventory.getInstance();
  const priceChangeWorksheetsImporter = new PriceChangeWorksheetsImporter();
  await priceChangeWorksheetsImporter.initialize();

  const coreSupport = CoreSets.getInstance().getCoreSupport();

  const exportArrayHeader = [
    "UPC",
    "Brand",
    "Description",
    "Subdepart",
    "Current Base Price",
    "Lowest Price",
    "Core Set Retail",
    "Desired price or leave blank to keep Current Retail",
    "Notes",
    "Dept",
    "Difference"
  ];

  let outputText = exportArrayHeader.join("\t") + "\n";

  const worksheetsByName = new Map<string, PriceChangeWorksheetImporter>();

  const items = new Map<string, ItemEntry>();

  priceChangeWorksheetsImporter.forEachWorksheet((worksheet) => {
    worksheetsByName.set(worksheet.textFilePath, worksheet);

    worksheet.forEachEntry((entry) => {
      let item = items.get(entry.scanCode.toString());

      let worksheetEntries: Map<string, WorkSheetEntry>;
      //first time we have proccessed this item, create empty worksheetEntries

      if (item) {
        worksheetEntries = item.worksheetEntries;
      } else {
        worksheetEntries = new Map<string, WorkSheetEntry>();
        item = {
          worksheetEntries: worksheetEntries,
          inventoryEntry: inventoryImporter.getEntryFromScanCode(entry.scanCode)
        };
        const worksheetEntry = {
          priceChangeWorksheetEntry: entry,
          worksheet: worksheet
        };
        //add worksheet entry to item worksheetEntries
        item.worksheetEntries.set(worksheet.textFilePath, worksheetEntry);
        //add item to items
        items.set(entry.scanCode.toString(), item);
      }
    });
  });

  coreSupport.ourCoreItems.forEach((coreSupportEntry) => {
    const inventoryEntry = inventoryImporter.getEntryFromScanCode(
      coreSupportEntry.id
    );

    if (inventoryEntry !== undefined) {
      let lowestPricedWorksheetName = "Base Price";
      //Create an export Array for the entry
      let lowestPrice = parseFloat(inventoryEntry.BasePrice.replace("$", ""));
      const priceChangeItem = items.get(inventoryEntry.ScanCode);
      if (priceChangeItem != null) {
        Array.from(priceChangeItem.worksheetEntries.values()).forEach(
          (entry) => {
            if (
              lowestPrice >
              parseFloat(entry.priceChangeWorksheetEntry.modifiedPrice)
            ) {
              lowestPrice = parseFloat(
                entry.priceChangeWorksheetEntry.modifiedPrice
              );

              lowestPricedWorksheetName = path.basename(
                entry.worksheet.textFilePath || "Unknown Sale Worksheet"
              );
              //remove extension .txt or others from Name
              lowestPricedWorksheetName = lowestPricedWorksheetName.replace(
                /\.[^/.]+$/,
                ""
              );
            }
          }
        );
      }

      const exportArray = [
        inventoryEntry.ScanCode, //UPC
        inventoryEntry.Brand, //Brand
        inventoryEntry.Name, //Description
        inventoryEntry.SubDepartment, //Subdepart
        inventoryEntry.BasePrice, //Current Retail
        lowestPrice,
        coreSupportEntry.EDLPPrice, //Proposed Retail
        "", //Desired price or leave blank to keep Current Retail
        lowestPricedWorksheetName, //Notes
        inventoryEntry.Department, //Dept
        (lowestPrice - parseFloat(coreSupportEntry.EDLPPrice)).toFixed(2) //Difference
      ];
      //Add the exportArray to the output Text as a tab seperated value line
      outputText += exportArray.join("\t") + "\n";
    }
  });

  return outputText;
};

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
  worksheet: PriceChangeWorksheetImporter;
};
