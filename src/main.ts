/**
 * This is the main entry point interacting with Dalchemist through a web browser.
 * @module Main
 * @category Interactive Web Service
 * @internal
 * @example
 * npm run start
 */
// todo: Start a server
// connect post requests to generators outputs
import packageInfo from "../package.json" assert { type: "json" };
console.log(
  `Dalchemist Version 0.0.1
    Input files go in Data/Inputs

    To generate output files use: 
    npm run outputAll 

    Web Server Starting    `
);

import express from "express";
//👉 Core Support
import { CoreSupport } from "./Processors/CoreSupport";
import PriceChangeWorksheetInventoryComparisons from "./Processors/PriceChangeWorksheetInventoryComparisons";
//Import the Inventory And Pricechange Importers
import InventoryImporter from "./TextImporters/Inventory";
import PriceChangeImporter from "./TextImporters/PriceChange";
import PriceBookImporter from "./TextImporters/PriceBook";
import SubMarginsImporter from "./TextImporters/SubMargins";

//import PriceChecker processor
import PriceChecker from "./Processors/PriceChecker";

import DuplicateEntry from "./TextImporters/DuplicateEntry";

// Only want to import Generators here

async function start() {
  //Create new Import objects
  const InventoryImport = new InventoryImporter();
  const PriceChangeImport = new PriceChangeImporter();
  const PriceBookImport = new PriceBookImporter();
  const SubMarginsImport = new SubMarginsImporter();
  const DupCheckImport = new DuplicateEntry();

  await InventoryImport.start();
  await PriceChangeImport.start();
  await PriceBookImport.start();
  await SubMarginsImport.start();
  await DupCheckImport.start();

  //🧩 - Initialize Core Support
  console.log("Loading Core Support Instance");
  const coreSupport = new CoreSupport();
  await coreSupport.start();

  const priceChecker = new PriceChecker();
  await priceChecker.initialize();

  const priceChangeWorksheetInventoryComparisons =
    new PriceChangeWorksheetInventoryComparisons();
  await priceChangeWorksheetInventoryComparisons.initialize();

  const dalchemist = express();

  dalchemist.get("/", (request, result) => {
    result.send(`
    <pre>
Dalchemist Version ${packageInfo.version}
<H2>UNFI PriceChange: 📅 ${PriceChangeImport.getCreationDate()?.toDateString()}</H2> 
        Entries: ${PriceChangeImport.getNumberOfEntries()}
        Unexpected Entries: ${PriceChangeImport.getNumberOfMultipleAvailableDistributorItems()}
        Unexpected Lines: ${PriceChangeImport.getNumberOfInvalidLines()}
    

        <H2>UNFI PriceBook: ${PriceBookImport.getCreationDate()?.toDateString()}</H2> 
        Entries: ${PriceBookImport.getNumberOfEntries()}
        Unexpected Entries: ${PriceBookImport.getNumberOfMultipleAvailableDistributorItems()}
        Unexpected: ${PriceBookImport.getNumberOfInvalidLines()}
   

      <H2>Inventory: 📅 ${InventoryImport.getCreationDate()?.toDateString()}</H2> 
      Items: ${InventoryImport.getNumberOfEntries()}
      Unexpected Entries: ${InventoryImport.getNumberOfMultipleAvailableDistributorItems()}
      Unexpected Lines: ${InventoryImport.getNumberOfInvalidLines()}
    
        <H2>Core Support: 📅 ${coreSupport
          .getCreationDate()
          ?.toDateString()}</H2> 
          <a href="/CoreDistributorEntries">🎪 Filtered Items from our Distributors: ${coreSupport.getNumberOfEntries()}</a>
          <a href="/CoreEntries">🎪 Filtered items from our Distributors with entries in Catapult: ${
            coreSupport.ourCoreItems.size
          }</a>
          <a href="/CoreInvalidEntries">🔕 Filtered Distributor Items from Multiple Distributors:</a> ${coreSupport.getNumberOfMultipleAvailableDistributorItems()}
          <a href="/CoreInvalidLines">🔕 Unexpected Lines:</a> ${coreSupport.getNumberOfInvalidLines()}


          <H2>Extras: </H2>
          <a href="/process/subMarginCheck">📝 Get Sub Margin Report TSV:</a> 
          <a href="/generate/duplicates">📝 ${
            DupCheckImport.dupEntries.size
          } Duplicated Entries:</a> 

          
          
          </pre>
</pre>


`);
  });

  //change these to generator functions
  dalchemist.get("/generate/duplicates", async (request, result) => {
    const entries = DupCheckImport.entries;

    let output = "<pre>Duplicate Entries\n\n";
    DupCheckImport.dupEntries.forEach((entry) => {
      const originalEntry = entries.get(entry[0].scanCode);
      if (originalEntry != null) {
        output += `${entry[0].scanCode} was in document ${
          entry.length + 1
        } times: \n`;

        output += `           :${originalEntry.scanCode}:${originalEntry.price} \n`;

        entry.forEach(() => {
          output += `           :${originalEntry.scanCode}:${originalEntry.price}\n`;
        });
      }
    });
    result.send(
      output +
        `\n\n${DupCheckImport.dupEntries.size} Duplicated Entries` +
        "</pre>"
    );
  });

  dalchemist.get("/process/subMarginCheck", async (request, result) => {
    const InventoryItemsInPriceBook = [...InventoryImport.entries.values()]
      .filter(function (InventoryEntry) {
        const subDepartment = InventoryEntry.subdepartment || "";
        const currentMargin = InventoryEntry.idealMargin || "";

        const expectedMargin =
          SubMarginsImport.getEntryFromSubDepartment(subDepartment)?.margin;

        if (
          expectedMargin &&
          expectedMargin.substring(0, 30).valueOf() ===
            currentMargin.substring(0, 30).valueOf()
        ) {
          return false;
        } else {
          return true;
        }
      }) //and map to an array of entries
      .map(function (entry) {
        return entry;
      });

    //Create Comma seperated string of scancodes from the items in both files
    let csvString = `Scan Code\tExpected Margin\tSet Margin\tSub Department\tDepartment\tBrand\tName\n`;
    InventoryItemsInPriceBook.forEach(function (entry) {
      const expectedMargin = SubMarginsImport.getEntryFromSubDepartment(
        entry.subdepartment
      )?.margin;
      csvString =
        csvString +
        `${entry.scanCode}\t${expectedMargin}\t${entry.idealMargin}\t${entry.subdepartment}\t${entry.department}\t${entry.brand}\t${entry.name}\n`;
    });

    result.send(`<pre>${csvString}</pre>`);
  });

  dalchemist.get(
    "/process/priceChangeWorksheetInventoryComparisons",
    async (request, result) => {
      result.send(
        `<pre>${priceChangeWorksheetInventoryComparisons.getOutput()}</pre>`
      );
    }
  );

  dalchemist.get(
    "/generate/lowerCostsInventoryPriceBookComparison",
    async (request, result) => {
      result.send(`<pre>${priceChecker.getLowerCostOutput()}</pre>`);
    }
  );

  dalchemist.get("/pricebook/InvalidEntries", async (request, result) => {
    let resultString = "";
    PriceBookImport.forEachInvalidEntry((entry) => {
      resultString += entry.valuesArray.join(" ") + "\n";
      const PBEnt = PriceBookImport.getEntryFromUPC(entry.UPC);
      if (PBEnt) {
        resultString += PBEnt.valuesArray.join(" ") + "\n";
      }
    });
    result.send(`<pre>${resultString}</pre>`);
  });

  dalchemist.listen(4848, () => {
    console.log("Web Server Ready");
  });
}

start().then();
