import { describe, expect, test } from "@jest/globals";

import TextImporter from "../src/TextImporters/TextImporter.js";

let textImporter = new TextImporter();

const DupCheckImport = new TextImporter();

let entryDups = {};
let dupEntries = {};
DupCheckImport.processedValues = [];

DupCheckImport.textFilePath = "./Data/Inputs/CheckForDups.txt";
DupCheckImport.processLine = function (line) {
  if (line) {
    let values = line.split("\t");
    //Split lines into an array of values

    let entry = this.entryFromValueArray(values);
    this.processedValues.push(entry);
  } else {
    this.invalidLines.push("No entry given");
  }
};

DupCheckImport.entryFromValueArray = function (valueArray) {
  let entry = {};
  //All values as array as received
  entry.valuesArray = valueArray;

  return entry;
};

describe("Testing Text Importer", () => {
  test("All lines imported", async () => {
    await DupCheckImport.start();
    expect(DupCheckImport.hasInvalidLines()).toBe(false);
    expect(DupCheckImport.getTotalEntries()).toBeGreaterThan(0);

    DupCheckImport.processLine();
    expect(DupCheckImport.hasInvalidLines()).toBe(true);
  });
});
