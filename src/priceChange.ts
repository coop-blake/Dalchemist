import express from "express";

import PriceChangeInventoryUpdate from "./Processors/PriceChangeInventoryUpdate";

async function start() {
  //Create new Import objects
  const PriceChangeUpdate = new PriceChangeInventoryUpdate();
  await PriceChangeUpdate.initialize();

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
    <a href="/NotFound">Found Entries By Supplier: ${
      supplierFoundPriceChangeEntries.size
    }</a>
    
    Inventory: ${invetoryImport.getCreationDate()?.toDateString()}
        Items: ${invetoryImport.getNumberOfEntries()}
        Invalid Entries: ${invetoryImport.getNumberOfInvalidEntries()}
        Invalid Lines: ${invetoryImport.getNumberOfInvalidLines()}
</pre>`);
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
