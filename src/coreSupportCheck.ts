/**
 * An interactive Web Service That reports on Core Support Data.
 * @module Core Support
 * @category Interactive Web Service
 * @internal
 * @example
 * npm run startCoreSetCheck
 */
import path from "path";
//👉 Express
import express from "express";
//👉 Core Support
import { CoreSupport } from "./Processors/CoreSupport";
//👉 Catapult Price Change Worksheets
import PriceChangeWorksheetsImporter from "./Processors/PriceChangeWorksheets";
import PriceChangeWorksheetImporter, {
  PriceChangeWorksheetEntry,
} from "./TextImporters/PriceChangeWorksheet";
//👉 Catapult Inventory
import InventoryImporter, { InventoryEntry } from "./TextImporters/Inventory";
//🏁 Start Function
async function start() {
  // Initializes imports, configures and starts Express

  //🧩 - Initialize Core Support
  console.log("Loading Core Support Instance");
  const coreSupport = new CoreSupport();
  await coreSupport.start();
  //🧩 - Initialize Catapult Inventory
  console.log("Loading Catapult Inventory");
  const inventoryImporter = new InventoryImporter();
  await inventoryImporter.start();
  //🧩 - Initialize Price Change Worksheet
  console.log("Loading Catapult Price Change Worksheets");
  const priceChangeWorksheetsImporter = new PriceChangeWorksheetsImporter();
  await priceChangeWorksheetsImporter.initialize();

  //🔥 - Create and Configure HTTP Server
  console.log("Creating http server");
  //Create Express Instance
  const dalchemist = express();

  // 🕸 - Index response
  dalchemist.get("/", (request, result) => {
    result.send(`<pre>
<H1>Core Set Price Check</H1>
    <H2>Loaded Catapult Inventory: 📅 ${inventoryImporter
      .getCreationDate()
      ?.toDateString()}</H2>
      🛒 Items: ${inventoryImporter.getNumberOfEntries()}
      🚫 Invalid Entries: ${inventoryImporter.getNumberOfMultipleAvailableDistributorItems()}
      🚫 Invalid Lines: ${inventoryImporter.getNumberOfInvalidLines()}
    <H2>Loaded Core Support Price List: 📅 ${coreSupport
      .getCreationDate()
      ?.toDateString()}</H2> 
      <a href="/CoreDistributorEntries">🎪 Number of Items from our Distributors: ${coreSupport.getNumberOfEntries()}</a>
      <a href="/CoreEntries">🎪 Number of Items from our Distributors with entries in Catapult: ${
        coreSupport.ourCoreItems.size
      }</a>
      <a href="/CoreInvalidEntries">🔕 Number of Valid Items from Multiple Distributors:</a> ${coreSupport.getNumberOfMultipleAvailableDistributorItems()}
      <a href="/CoreInvalidLines">🔕 Invalid Lines:</a> ${coreSupport.getNumberOfInvalidLines()}
      </pre>
      <H2>Core Support Overview Report:</H2>
    
<br/>
        <a href="/AllOurCoreSetItemsWithCatapultPricing"> Get Core Support Overview Report</a>



`);
  });
  // 🕸 - AllOurCoreSetItemsWithCatapultPricing response
  dalchemist.get(
    "/AllOurCoreSetItemsWithCatapultPricing",
    async (request, result) => {
      result.send(
        `<pre>${createCoreSupportWithCatapultPricingTSV(
          inventoryImporter,
          priceChangeWorksheetsImporter,
          coreSupport
        )}</pre>`
      );
    }
  );
  dalchemist.get("/NotOurInventory", async (request, result) => {
    const exportArrayHeader = [
      "CoreSetsRound",
      "BuyInStart",
      "BuyInEnd",
      "Dept",
      "Category",
      "Distributor",
      "DistributorProductID",
      "UPCA",
      "FormattedUPC",
      "ReportingUPC",
      "Brand",
      "Description",
      "UnitCount",
      "PackSize",
      "PromoOI",
      "PromoMCB",
      "RebatePerUnit",
      "SaleCaseCost",
      "SaleUnitCost",
      "EDLPPrice",
      "Margin",
      "LineNotes",
      "Changes",

      "ID",
    ];

    let outputText = exportArrayHeader.join("\t") + "\n";

    coreSupport.forEachEntry((entry) => {
      if (coreSupport.ourCoreItems.has(entry.ID)) {
        outputText += Object.values(entry).join("\t") + "\n";
      }
    });

    result.send(`<pre>${outputText}</pre>`);
  });

  dalchemist.get("/CoreInvalidLines", async (request, result) => {
    let outputText = "Core Supports with duplicate UPCs\n\n";

    coreSupport.forEachInvalidLine((line) => {
      outputText += line + "\n";
    });

    result.send(`<pre>${outputText}</pre>`);
  });

  dalchemist.get("/CoreDistributorEntries", async (request, result) => {
    let outputText = "Core Support Distributor Items\n\n";

    coreSupport.forEachEntry((entry) => {
      outputText += Object.values(entry).join("\t") + "\n";
    });

    result.send(`<pre>${outputText}</pre>`);
  });
  dalchemist.get("/CoreEntries", async (request, result) => {
    let outputText = "Core Support Distributor Items in\n\n";

    coreSupport.ourCoreItems.forEach((entry) => {
      outputText += Object.values(entry).join("\t") + "\n";
    });

    result.send(`<pre>${outputText}</pre>`);
  });

  dalchemist.get("/CoreInvalidEntries", async (request, result) => {
    let outputText = "Core Support Entries Not Found in Inventory\n\n";

    coreSupport.forEachInvalidEntry((entry) => {
      const existingEntry = coreSupport.getEntryFromScanCode(entry.ID);
      outputText += "###############################################\n";

      outputText += Object.values(entry).join(" | ") + "\n";
      if (existingEntry) {
        outputText += Object.values(existingEntry).join(" | ") + "\n";
      }
    });

    result.send(`<pre>${outputText}</pre>`);
  });

  dalchemist.listen(4848, () => {
    console.log("Web Server Ready");
  });
}

start().then();

/**
 * Creates an outputText that contains a comparison of core support and
 * Catapult Pricing information.
 *
 * @param inventoryImporter
 * @param coreSupport
 * @returns
 */
const createCoreSupportWithCatapultPricingTSV = function (
  inventoryImporter: InventoryImporter,
  priceChangeWorksheetsImporter: PriceChangeWorksheetsImporter,
  coreSupport: CoreSupport
): string {
  const exportArrayHeader = [
    "UPC",
    "Brand",
    "Description",
    "Subdepart",
    "Current Base Price",
    "Lowest Promo Price",
    "Core Set Retail",
    "Desired price or leave blank to keep Current Retail",
    "Notes",
    "Dept",
    "Difference",
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
          inventoryEntry: inventoryImporter.getEntryFromScanCode(
            entry.scanCode
          ),
        };
        const worksheetEntry = {
          priceChangeWorksheetEntry: entry,
          worksheet: worksheet,
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
      coreSupportEntry.ID
    );

    if (inventoryEntry !== undefined) {
      let lowestPricedWorksheetName = "Base Price";
      //Create an export Array for the entry
      let lowestPrice = parseFloat(inventoryEntry.basePrice);
      const priceChangeItem = items.get(inventoryEntry.scanCode);
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
        inventoryEntry.scanCode, //UPC
        inventoryEntry.brand, //Brand
        inventoryEntry.name, //Description
        inventoryEntry.subdepartment, //Subdepart
        inventoryEntry.basePrice, //Current Retail
        lowestPrice,
        coreSupportEntry.EDLPPrice, //Proposed Retail
        "", //Desired price or leave blank to keep Current Retail
        lowestPricedWorksheetName, //Notes
        inventoryEntry.department, //Dept
        (lowestPrice - parseFloat(coreSupportEntry.EDLPPrice)).toFixed(2), //Difference
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
