/**
 * An interactive Web Service That reports on UNFI Price Change and Inventory.
 * @module UNFI Price Change Update
 * @category Interactive Web Service
 * @internal
 * @example
 * npm run startPriceUpdate
 */

import express from "express";
import { CoreSupport } from "./Processors/CoreSupport";
import PriceChangeInventoryUpdate from "./Processors/PriceChangeInventoryUpdate";
import { PriceChangeEntry } from "./TextImporters/PriceChange";
import { InventoryEntry } from "./TextImporters/Inventory";

async function start() {
  console.log("Loading Price Change Instance");
  //Create and initialize Price Change Update
  const PriceChangeUpdate = new PriceChangeInventoryUpdate();
  await PriceChangeUpdate.initialize();
  //Create and initialize Core Support
  console.log("Loading Core Support Instance");
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

  console.log("Creating http server");
  //Create Express Instance
  const dalchemist = express();
  //index response
  dalchemist.get("/", (request, result) => {
    result.send(`<pre>
<H1>UNFI Price Update</H1>
    <H2>Catapult Inventory: 📅 ${invetoryImport
      .getCreationDate()
      ?.toDateString()}</H2>
      🛒 Items: ${invetoryImport.getNumberOfEntries()}
      🚫 Invalid Entries: ${invetoryImport.getNumberOfMultipleAvailableDistributorItems()}
      🚫 Invalid Lines: ${invetoryImport.getNumberOfInvalidLines()}
    <H2>Core Support Price List: 📅 ${coreSupport
      .getCreationDate()
      ?.toDateString()}</H2> 
      <a href="/CoreDistributorEntries">🎪 Number of Items from our Distributors: ${coreSupport.getNumberOfEntries()}</a>
      <a href="/CoreEntries">🎪 Number of Items from our Distributors with entries in Catapult: ${
        coreSupport.ourCoreItems.size
      }</a>
      <a href="/CoreInvalidEntries">🔕 Number of Valid Items from Multiple Distributors:</a> ${coreSupport.getNumberOfMultipleAvailableDistributorItems()}
      <a href="/CoreInvalidLines">🔕 Invalid Lines:</a> ${coreSupport.getNumberOfInvalidLines()}
    <H2>UNFI Price Changes: North 📅 ${priceChangeImporterNorth
      .getCreationDate()
      ?.toDateString()} : South 📅 ${priceChangeImporterSouth
      .getCreationDate()
      ?.toDateString()}</H2>
      <b>North:</b>
          Entries: ${priceChangeImporterNorth.getNumberOfEntries()}
          Invalid Entries: ${priceChangeImporterNorth.getNumberOfMultipleAvailableDistributorItems()}
          Lines: ${priceChangeImporterNorth.getNumberOfInvalidLines()}
      <b>South:</b>
          Entries: ${priceChangeImporterSouth.getNumberOfEntries()}
          Invalid Entries: ${priceChangeImporterSouth.getNumberOfMultipleAvailableDistributorItems()}
          Lines: ${priceChangeImporterSouth.getNumberOfInvalidLines()}    
      <b>Duplicate Entries:</b>
          <a href="/Duplicates">Entries: </a> ${duplicatedEntries.length}
          <a href="/DuplicatedDifferent">Different Entries: </a> ${
            duplicatedDifferentEntries.length
          }
          <a href="/CombinedUNFIPriceChangeEntries">Combined Entries:</a> ${
            combinedPriceChangeEntries.size
          }
      <b>Final Entries:</b> ${checkedPriceChangeEntries.size}
      <a href="/NotFound">👓 Not Found Entries: ${
        notFoundPriceChangeEntries.size
      }</a>
      <a href="/FoundSupplier">👓 Found Entries By Supplier: ${
        supplierFoundPriceChangeEntries.size
      }</a>
    

        <a href="/CombinedUNFIPriceChangeEntriesForImport">Get Final TSV Export</a>
</pre>`);
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
      outputText += entry.valuesArray.join("\t") + "\n";
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
    //Remove the Penny Value and replace with a 9
    //todo: Add Rounding module to repository
    const proposedPrice =
      (
        parseFloat(parseFloat(priceChangeEntry.NewEachPrice).toFixed(2)) /
        (1 - parseInt(inventoryEntry.idealMargin) * 0.01)
      ).toFixed(1) + "9";

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
      proposedPrice, //Proposed Retail
      "", //Desired price or leave blank to keep Current Retail
      coreSupportEntry && coreSupportEntry.EDLPPrice
        ? `Core Support ${coreSupportEntry.EDLPPrice}`
        : "", //Notes
      inventoryEntry.department, //Dept
      (
        parseFloat(proposedPrice) - parseFloat(inventoryEntry.basePrice)
      ).toFixed(2), //Difference
      "", //North Done
      "", //South Done
    ];
    //Add the exportArray to the output Text as a tab seperated value line
    outputText += exportArray.join("\t") + "\n";
  });

  return outputText;
};
