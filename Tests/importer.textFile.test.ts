import { describe, expect, test } from "@jest/globals";
import {
  StringsAssimilator,
  LineReader,
  Importer
} from "../src/Importers/Base";

import { SeperatedTextFileInputStream } from "../src/Importers/TextFile";
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

const testInputStream = new SeperatedTextFileInputStream(
  "./Tests/testForImporterStream.txt"
);

describe("Text File Input Stream", () => {
  test("SHould return a String Matrix", async () => {
    const TextFileLines = await testInputStream.getLines();
    expect(TextFileLines.length).toBeGreaterThan(0);
  });
});
describe("Text File Input Stream", () => {
  test("SHould return a String Matrix", async () => {
    const importer = new Importer(testLineReader, testInputStream);
    const entries = await importer.start();
    console.log(entries);
    expect(importer.getNumberOfEntries()).toBe(2);
    expect(importer.getNumberOfUnrecognizedEntries()).toBe(2);
  });
});
