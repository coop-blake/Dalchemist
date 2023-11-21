import { describe, expect, test } from "@jest/globals";
import {
  StringsAssimilator,
  LineReader,
  Importer
} from "../../src/Importer/Base";

import { SheetInput } from "../../src/Importer/InputLines/Sheet";
const sheetID = "1iXJ2zDwDzzuQxYWh8NX7IAakquLkZDURiqVnhWPr4t4";
const sheetRange = "Sheet1!A2:D5";
/* To use the entry assimilator, you need to define an entry */

type TestEntry = {
  name: string;
  test: string;
  value: number;
};

/* Then you define your Assimilator*/

class TestAssimilator extends StringsAssimilator<TestEntry> {
  digest() {
    return this.raw.length === 3
      ? {
          name: this.raw[0],
          test: this.raw[1],
          value: parseInt(this.raw[2])
        }
      : null;
  }
}
//give it to the LineReader
class TestLineReader extends LineReader<TestEntry> {}

const testLineReader = new TestLineReader(TestAssimilator);

const testInputSheetStream = new SheetInput(sheetID, sheetRange);

describe("Text File Input Stream", () => {
  test("Should return some lines", async () => {
    const lines = await testInputSheetStream.getLines();
    expect(lines.length).toBeGreaterThan(0);
  });
});
describe("Text File Input Stream", () => {
  test("Should Have Entries and Unrecognized Entries", async () => {
    const importer = new Importer(testLineReader, testInputSheetStream);
    await importer.start();
    expect(importer.getNumberOfEntries()).toBe(2);
    expect(importer.getNumberOfUnrecognizedEntries()).toBe(2);
  });
});
