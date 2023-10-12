import { describe, expect, test } from "@jest/globals";
import * as path from "path";
import {
  StringsAssimilator,
  LineReader,
  Importer
} from "../../src/Importers/Base";

import { SeperatedTextInput } from "../../src/Importers/Text";
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

const testInputStream = new SeperatedTextInput(
  path.join(__dirname, "testFiles/testForImporterStream.txt")
);

describe("Text File Input Stream", () => {
  test("SHould return a String Matrix", async () => {
    const TextFileLines = await testInputStream.getLines();
    expect(TextFileLines.length).toBeGreaterThan(0);
  });
});
describe("Text File Input Stream", () => {
  test("Should return a String Matrix", async () => {
    const importer = new Importer(testLineReader, testInputStream);
    const entries = await importer.start();
    console.log(entries);
    expect(importer.getNumberOfEntries()).toBe(3);
    expect(importer.getNumberOfUnrecognizedEntries()).toBe(1);
  });
});
