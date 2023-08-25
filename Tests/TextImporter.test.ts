import { describe, expect, test } from "@jest/globals";

import PriceChecker from "../src/Processors/PriceChecker";
//Create new PriceChecker
const priceChecker = new PriceChecker();
//Initialize to load input files
//Get and print output to console
//console.log(priceChecker.getLowerCostOutput());

describe("Testing Text Importer", () => {
  test("All lines imported", async () => {
    await priceChecker.initialize();

    expect(true).toBe(true);
  });
});

// import TextImporter from "../src/TextImporters/TextImporter.js";

// const DupCheckImport = new TextImporter();

// DupCheckImport.textFilePath = "./Data/Inputs/CheckForDups.txt";
// DupCheckImport.processLine = function (line) {
//   if (line) {
//     let values = line.split("\t");
//     //Split lines into an array of values

//     let entry = this.entryFromValueArray(values);
//     this.processedValues.push(entry);
//   } else {
//     this.invalidLines.push("No entry given");
//   }
// };

// DupCheckImport.entryFromValueArray = function (valueArray) {
//   let entry = {};
//   //All values as array as received
//   entry.valuesArray = valueArray;

//   return entry;
// };

//
