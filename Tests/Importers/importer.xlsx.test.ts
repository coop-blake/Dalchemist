import { describe, expect, test } from "@jest/globals";
import * as path from "path";
import {
  StringsAssimilator,
  LineReader,
  Importer
} from "../../src/Importers/Base";

import { XlsxInput } from "../../src/Importers/Xlsx";
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

const testInputTextFileStream = new XlsxInput(
  path.join(__dirname, "testFiles/testForImporterStream.txt")
);

const testInputXLSXFileStream = new XlsxInput(
  path.join(__dirname, "testFiles/testForImporterStream.xlsx")
);

const testInputItemsXLSXFileStream = new XlsxInput(
  path.join(__dirname, "testFiles/testItems.xlsx")
);

describe("Text File Input Stream", () => {
  test("Should return some lines", async () => {
    const lines = await testInputTextFileStream.getLines();
    expect(lines.length).toBeGreaterThan(0);
  });
  test("Should return some lines", async () => {
    const lines = await testInputXLSXFileStream.getLines();
    expect(lines.length).toBeGreaterThan(0);
  });
});
describe("Text File Input Stream", () => {
  test("Should Have Entries and Unrecognized Entries", async () => {
    const importer = new Importer(testLineReader, testInputTextFileStream);
    await importer.start();
    expect(importer.getNumberOfEntries()).toBe(2);
    expect(importer.getNumberOfUnrecognizedEntries()).toBe(2);
  });
});

describe("XLSX File Input Stream", () => {
  test("Should Have Entries and Unrecognized Entries", async () => {
    const importer = new Importer(testLineReader, testInputXLSXFileStream);
    await importer.start();
    expect(importer.getNumberOfEntries()).toBe(2);
    expect(importer.getNumberOfUnrecognizedEntries()).toBe(2);
  });
});

describe("XLSX File Input Stream More items", () => {
  test("Should Have Entries and No Unrecognized Entries", async () => {
    const importer = new Importer(testLineReader, testInputItemsXLSXFileStream);
    await importer.start();
    expect(importer.getNumberOfEntries()).toBe(22);
    expect(importer.getNumberOfUnrecognizedEntries()).toBe(0);
  });
});
