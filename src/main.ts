/**
 * @module Main
 * @category Executable
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

import PriceChangeWorksheetInventoryComparisons from "./Processors/PriceChangeWorksheetInventoryComparisons";
//Import the Inventory And Pricechange Importers
import InventoryImporter from "./TextImporters/Inventory";
import PriceChangeImporter, {
  PriceChangeEntry,
} from "./TextImporters/PriceChange";
import PriceBookImporter, { PriceBookEntry } from "./TextImporters/PriceBook";
import SubMarginsImporter from "./TextImporters/SubMargins";

//import PriceChecker processor
import PriceChecker from "./Processors/PriceChecker";

async function start() {
  //Create new Import objects
  const InventoryImport = new InventoryImporter();
  const PriceChangeImport = new PriceChangeImporter();
  const PriceBookImport = new PriceBookImporter();
  const SubMarginsImport = new SubMarginsImporter();

  await InventoryImport.start();
  await PriceChangeImport.start();
  await PriceBookImport.start();
  await SubMarginsImport.start();

  const priceChecker = new PriceChecker();
  await priceChecker.initialize();

  const priceChangeWorksheetInventoryComparisons =
    new PriceChangeWorksheetInventoryComparisons();
  await priceChangeWorksheetInventoryComparisons.initialize();

  const dalchemist = express();

  dalchemist.get("/", (request, result) => {
    result.send(`<pre>
Dalchemist Version ${packageInfo.version}
    PriceChange: ${PriceChangeImport.getCreationDate()?.toDateString()}
        Entries: ${PriceChangeImport.getNumberOfEntries()}
        Invalid Entries: ${PriceChangeImport.getNumberOfInvalidEntries()}
        Lines: ${PriceChangeImport.getNumberOfInvalidLines()}
    PriceBook: ${PriceBookImport.getCreationDate()?.toDateString()}
        Entries: ${PriceBookImport.getNumberOfEntries()}
        Invalid Entries: ${PriceBookImport.getNumberOfInvalidEntries()}
        Lines: ${PriceBookImport.getNumberOfInvalidLines()}
    Inventory: ${InventoryImport.getCreationDate()?.toDateString()}
        Items: ${InventoryImport.getNumberOfEntries()}
        Invalid Entries: ${InventoryImport.getNumberOfInvalidEntries()}
        Invalid Lines: ${InventoryImport.getNumberOfInvalidLines()}
</pre>`);
  });

  InventoryImport.getNumberOfInvalidEntries();

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
