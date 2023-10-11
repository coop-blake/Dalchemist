import { describe, expect, test } from "@jest/globals";
import { StringsAssimilator, LineReader } from "../src/Readers/LineReader";

describe("Entry Assimilator", () => {
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

  test("Is it a ", async () => {
    /* Get some raw data */
    const rawStrings = ["nameString", "This is a test", "10"];
    /* and Digest it to your type*/
    const testEntry = new TestAssimilator(rawStrings).digest();
    expect(testEntry?.name).toBe("nameString");
  });

  test("Unexpected Data Returns Null", async () => {
    /* this should cause the digest to retun null */
    /* Get some raw data plus */
    const rawStrings = ["nameString", "This is a test", "10", "Extra"];
    /* and Digest it to your type*/
    const testEntry = new TestAssimilator(rawStrings).digest();
    expect(testEntry).toBe(null);
  });

  test("Read An Array of Array of Strings", async () => {
    const testLineRead = testLineReader.read([
      "nameString",
      "This is a test",
      "10"
    ]);
    expect(testLineRead?.test).toBe("This is a test");
  });
});
