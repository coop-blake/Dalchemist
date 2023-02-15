import express from "express";
import { CoreSupport } from "./Processors/CoreSupport";

import PriceChangeInventoryUpdate from "./Processors/PriceChangeInventoryUpdate";

async function start() {
  //Create new Import objects
  const PriceChangeUpdate = new PriceChangeInventoryUpdate();
  await PriceChangeUpdate.initialize();

  const coreSupport = new CoreSupport();
  await coreSupport.start()

  const priceChangeImporterNorth = PriceChangeUpdate.getNorthImporter();
  const priceChangeImporterSouth = PriceChangeUpdate.getSouthImporter();
  const invetoryImport = PriceChangeUpdate.getInventoryImporter();

  const duplicatedEntries = PriceChangeUpdate.getDuplicateEntries();
  const duplicatedDifferentEntries =
    PriceChangeUpdate.getDuplicatedDifferentEntries();

  const combinedPriceChangeEntries =
    PriceChangeUpdate.getCombinedPriceChangeEntries();
  const checkedPriceChangeEntries =
    PriceChangeUpdate.getCheckedPriceChangeEntries();

  const notFoundPriceChangeEntries =
    PriceChangeUpdate.getNotFoundPriceChangeEntries();

  const supplierFoundPriceChangeEntries =
    PriceChangeUpdate.getSupplierFoundPriceChangeEntries();

  const dalchemist = express();

  dalchemist.get("/", (request, result) => {
    result.send(`<pre>
UNFI Price Update
    Core Support Price List: ${coreSupport
      .getCreationDate()
      ?.toDateString()}
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

    Combined Entries: ${combinedPriceChangeEntries.size}
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
</pre>`);
  });


  dalchemist.get("/CoreInvalidLines", async (request, result) => {
    let outputText = "Core Supports with duplicate UPCs\n\n";

    coreSupport.forEachInvalidLine((line) => {
      outputText += line+ "\n";
    });

    result.send(`<pre>${outputText}</pre>`);
  });

  dalchemist.get("/CoreInvalidEntries", async (request, result) => {
    let outputText = "Price Change Entries Not Found in Inventory\n\n";

    coreSupport.forEachInvalidEntry((entry) => {
      const existingEntry = coreSupport.getEntryFromScanCode(entry.ID)
      outputText += "###############################################\n";

      outputText += Object.values(entry).join(" | " )+ "\n";
      outputText += Object.values(existingEntry).join(" | " )+ "\n";

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
    let outputText = "Price Change Entries Not Found in Inventory\n\n";

    [...supplierFoundPriceChangeEntries.values()].forEach((entry) => {
      outputText += entry.valuesArray.join(" ") + "\n";
    });

    result.send(`<pre>${outputText}</pre>`);
  });

  dalchemist.listen(4848, () => {
    console.log("Web Server Ready");
  });
}

start().then();
