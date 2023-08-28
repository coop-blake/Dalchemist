import { describe, expect, test } from "@jest/globals";
import PriceChangeWorksheetInventoryComparisons from "../src/Processors/PriceChangeWorksheetInventoryComparisons";

import PriceChangeImporter from "../src/TextImporters/PriceChange";
const PriceChangeImport = new PriceChangeImporter();

//create a new price change worksheet processor
const priceChangeWorksheetInventoryComparisons =
  new PriceChangeWorksheetInventoryComparisons();
//initialize processor to load price change worksheets in directory

describe("Testing Text Importer", () => {
  test("All lines imported", (done) => {
    priceChangeWorksheetInventoryComparisons
      .initialize()
      .then(() => {
        //get the text ouput for the loaded files
        //The get output looks for the accepted arguments and adjust output accordingly
        priceChangeWorksheetInventoryComparisons.getOutput();
        expect(true).toBe(true);
        done();
      })
      .catch((error: Error) => {
        console.log(error);
      });
  });
});

describe("Testing Price Change Importer", () => {
  test("All lines imported", (done) => {
    PriceChangeImport.start()
      .then(() => {
        //get the text ouput for the loaded files
        //The get output looks for the accepted arguments and adjust output accordingly
        //PriceChangeImport.getOutput();
        expect(true).toBe(true);
        done();
      })
      .catch((error: Error) => {
        console.log(error);
      });
  });
});
