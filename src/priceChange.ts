import express from "express";
import { CoreSupport } from "./Processors/CoreSupport";
import PriceChangeInventoryUpdate from "./Processors/PriceChangeInventoryUpdate";
import { PriceChangeEntry } from "./TextImporters/PriceChange";
import { InventoryEntry } from "./TextImporters/Inventory";

async function start() {
  console.log("Loading Price Change Instance")
  //Create and initialize Price Change Update
  const PriceChangeUpdate = new PriceChangeInventoryUpdate();
  await PriceChangeUpdate.initialize();
  //Create and initialize Core Support
  console.log("Loading Core Support Instance")
  const coreSupport = new CoreSupport();
  await coreSupport.start();
  //Get Price change importers for each store
  const priceChangeImporterNorth = PriceChangeUpdate.getNorthImporter();
  const priceChangeImporterSouth = PriceChangeUpdate.getSouthImporter();
  //get Inventory File Impoter
  const invetoryImport = PriceChangeUpdate.getInventoryImporter();
  //get Duplicated Price Change Update Entries
  const duplicatedEntries = PriceChangeUpdate.getDuplicateEntries();
  //get Duplicated and Different Price Change Update Entries
  const duplicatedDifferentEntries =
    PriceChangeUpdate.getDuplicatedDifferentEntries();
  //get Combined Price Change Entries
  const combinedPriceChangeEntries =
    PriceChangeUpdate.getCombinedPriceChangeEntries();
  //get checkedPriceChangeEntries
  const checkedPriceChangeEntries =
    PriceChangeUpdate.getCheckedPriceChangeEntries();
  //get not Found Price Change Entries
  const notFoundPriceChangeEntries =
    PriceChangeUpdate.getNotFoundPriceChangeEntries();
  //get Price Change entries matched by supplier ID
  const supplierFoundPriceChangeEntries =
    PriceChangeUpdate.getSupplierFoundPriceChangeEntries();

  console.log("Creating http server")
  //Create Express Instance
  const dalchemist = express();
  //index response
  dalchemist.get("/", (request, result) => {
    result.send(`<pre>
UNFI Price Update
    Core Support Price List: ${coreSupport.getCreationDate()?.toDateString()}
      Number of Items: ${coreSupport.getNumberOfEntries()}
      Number of our Items: ${coreSupport.ourCoreItems.size}

      <a href="/CoreInvalidEntries">Invalid Entries:</a> ${coreSupport.getNumberOfInvalidEntries()}
      <a href="/CoreInvalidLines">Invalid Lines:</a> ${coreSupport.getNumberOfInvalidLines()}
    North PriceChange: ${priceChangeImporterNorth
      .getCreationDate()
      ?.toDateString()}
        Entries: ${priceChangeImporterNorth.getNumberOfEntries()}
        Invalid Entries: ${priceChangeImporterNorth.getNumberOfInvalidEntries()}
        Lines: ${priceChangeImporterNorth.getNumberOfInvalidLines()}
    South PriceBook: ${priceChangeImporterSouth
      .getCreationDate()
      ?.toDateString()}
        Entries: ${priceChangeImporterSouth.getNumberOfEntries()}
        Invalid Entries: ${priceChangeImporterSouth.getNumberOfInvalidEntries()}
        Lines: ${priceChangeImporterSouth.getNumberOfInvalidLines()}
        
    Duplicate Entries: 
        <a href="/Duplicates">Entries: </a> ${duplicatedEntries.length}
        <a href="/DuplicatedDifferent">Different Entries: </a> ${
          duplicatedDifferentEntries.length
        }

        <a href="/CombinedUNFIPriceChangeEntries">Combined Entries:</a> ${
          combinedPriceChangeEntries.size
        }
    Checked Entries: ${checkedPriceChangeEntries.size}
    <a href="/NotFound">Not Found Entries: ${
      notFoundPriceChangeEntries.size
    }</a>
    <a href="/FoundSupplier">Found Entries By Supplier: ${
      supplierFoundPriceChangeEntries.size
    }</a>
    
    Inventory: ${invetoryImport.getCreationDate()?.toDateString()}
        Items: ${invetoryImport.getNumberOfEntries()}
        Invalid Entries: ${invetoryImport.getNumberOfInvalidEntries()}
        Invalid Lines: ${invetoryImport.getNumberOfInvalidLines()}



        <a href="/CombinedUNFIPriceChangeEntriesForImport">Get TSV Export</a>
</pre>`);
  });

  dalchemist.get("/CoreInvalidLines", async (request, result) => {
    let outputText = "Core Supports with duplicate UPCs\n\n";

    coreSupport.forEachInvalidLine((line) => {
      outputText += line + "\n";
    });

    result.send(`<pre>${outputText}</pre>`);
  });

  dalchemist.get("/CoreInvalidEntries", async (request, result) => {
    let outputText = "Price Change Entries Not Found in Inventory\n\n";

    coreSupport.forEachInvalidEntry((entry) => {
      const existingEntry = coreSupport.getEntryFromScanCode(entry.ID);
      outputText += "###############################################\n";

      outputText += Object.values(entry).join(" | ") + "\n";
      if(existingEntry){
        outputText += Object.values(existingEntry).join(" | ") + "\n";
      }
    });

    result.send(`<pre>${outputText}</pre>`);
  });

  dalchemist.get("/Duplicates", async (request, result) => {
    result.send(
      `<pre>${PriceChangeUpdate.getDuplicatePriceChangeEntriesTextReport()}</pre>`
    );
  });

  dalchemist.get("/DuplicatedDifferent", async (request, result) => {
    result.send(
      `<pre>${PriceChangeUpdate.getDuplicatedDifferentPriceChangeEntriesTextReport()}</pre>`
    );
  });

  dalchemist.get("/NotFound", async (request, result) => {
    let outputText = "Price Change Entries Not Found in Inventory\n\n";

    [...notFoundPriceChangeEntries.values()].forEach((entry) => {
      outputText += entry.valuesArray.join(" ") + "\n";
    });

    result.send(`<pre>${outputText}</pre>`);
  });

  dalchemist.get("/FoundSupplier", async (request, result) => {
    let outputText = "Price Change Entries Found by Supplier Item ID\n\n";

    [...supplierFoundPriceChangeEntries.values()].forEach(
      ([entry, inventoryEntry]) => {
        outputText += "###############################################\n\n";
        outputText += entry.valuesArray.join(" ") + "\n";

        outputText += inventoryEntry.valuesArray.join(" ") + "\n\n";
      }
    );

    result.send(`<pre>${outputText}</pre>`);
  });

  dalchemist.get("/CombinedUNFIPriceChangeEntries", async (request, result) => {
    let outputText = "";
    PriceChangeUpdate.getCombinedEntries().forEach((entry) => {
      outputText += `${entry.valuesArray.join(" ")}\n`;
    });

    result.send(`<pre>${outputText}</pre>`);
  });

  dalchemist.get(
    "/CombinedUNFIPriceChangeEntriesForImport",
    async (request, result) => {
      result.send(
        `<pre>${createCombinedUNFIPriceChangeEntriesForImport(
          PriceChangeUpdate.getCheckedPriceChangeEntries(),
          coreSupport
        )}</pre>`
      );
    }
  );

  dalchemist.listen(4848, () => {
    console.log("Web Server Ready");
  });
}

start().then();

/**
 * Takes the Checked UNFI Price Change Entries combines
 * with Core support and Price Change Worksheet Data to
 * produce a tab seperated list of the combined entries
 * for importing to a new Sheet
 *
 * @param checkedEntries
 * @param coreSupport
 * @returns
 */
const createCombinedUNFIPriceChangeEntriesForImport = function (
  checkedEntries: Map<string, [PriceChangeEntry, InventoryEntry]>,
  coreSupport: CoreSupport
): string {
  const exportArrayHeader = [
    "UPC",
    "Brand",
    "Description",
    "MPW #",
    "Pack/Size",
    "Status",
    "Dept",
    "Change Date",
    "Type",
    "Change %",
    "Pack",
    "Subdepart",
    "Margin",
    "Current Case",
    "New Case",
    "Current Each",
    "New Each",
    "Current Retail",
    "Proposed Retail",
    "Desired price or leave blank to keep Current Retail",
    "Notes",
    "Dept",
    "Difference",
    "North Done",
    "South Done",
  ];

  let outputText = exportArrayHeader.join("\t") + "\n";

  [...checkedEntries.values()].forEach(([priceChangeEntry, inventoryEntry]) => {
    //Get Core Support Information for the inventory entry
    const coreSupportEntry = coreSupport.getEntryById(inventoryEntry.scanCode);
    //Create a proposed price using new Each price and Inventory ideal Margin
    const proposedPrice =
      parseFloat(priceChangeEntry.NewEachPrice) /
      (1 - parseFloat(inventoryEntry.idealMargin) * 0.01);

    //Create an export Array for the entry
    const exportArray = [
      inventoryEntry.scanCode, //UPC
      inventoryEntry.brand, //Brand
      inventoryEntry.name, //Description
      priceChangeEntry.MPW, //MPW #
      priceChangeEntry.PackSize, //Pack/Size
      priceChangeEntry.Status, //Status
      priceChangeEntry.Dept, //Dept
      priceChangeEntry.ChangeDate, //Change Date
      priceChangeEntry.Type, //Type
      priceChangeEntry.Change, //Change %
      priceChangeEntry.Pack, //Pack
      inventoryEntry.subdepartment, //Subdepart
      inventoryEntry.idealMargin, //Margin
      priceChangeEntry.PrevCasePrice, //Current Case
      priceChangeEntry.NewCasePrice, //New Case
      parseFloat(priceChangeEntry.PrevEachPrice).toFixed(2), //Current Each
      parseFloat(priceChangeEntry.NewEachPrice).toFixed(2), //New Each
      inventoryEntry.basePrice, //Current Retail
      proposedPrice.toFixed(2), //Proposed Retail
      "", //Desired price or leave blank to keep Current Retail
      coreSupportEntry && coreSupportEntry.WestRidgefieldEDLPPrice
        ? `Core Support ${coreSupportEntry.WestRidgefieldEDLPPrice}`
        : "", //Notes
      inventoryEntry.department, //Dept
      (parseFloat(priceChangeEntry.PrevEachPrice) - proposedPrice).toFixed(2), //Difference
      "", //North Done
      "", //South Done
    ];
    //Add the exportArray to the output Text as a tab seperated value line
    outputText += exportArray.join("\t") + "\n";
  });

  return outputText;
};
