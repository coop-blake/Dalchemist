import { describe, expect, test } from "@jest/globals";
import TextImporter from "../src/TextImporters/TextImporter";
const textImporter = new TextImporter();

describe("Text Importer", () => {
  test("Is it a TextImporter", async () => {
    await textImporter.start();
    expect(textImporter).toBeInstanceOf(TextImporter);
  });
});

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
