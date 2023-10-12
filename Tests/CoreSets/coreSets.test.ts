import { describe, expect, test, beforeAll } from "@jest/globals";
import { existsSync } from "fs";
import * as path from "path";

import { CoreSets } from "../../src/Resources/CoreSets/CoreSets";
import { CoreSupportEntry } from "../../src/Resources/CoreSets/CoreSupport";

const filePath = path.resolve("Data/Inputs/CoreSets.xlsx");

const coreSets = new CoreSets();

let entries = Array<CoreSupportEntry>();
beforeAll(async () => {
  entries = await coreSets.read("Data/Inputs/CoreSets.xlsx");
});
describe("Read Sample Core Sets File", () => {
  test(`Should have a file to read: ${filePath}`, async () => {
    if (!existsSync(filePath)) {
      console.error(
        `File not found. Please provide a Core Sets file path for testing. Expected File: ${filePath}`
      );
    }
    expect(existsSync(filePath)).toBe(true);
  });

  test("Should read some entries", async () => {
    expect(entries.length).toBeGreaterThan(0);
  });

  test("Should have correctly seperated entries", async () => {
    await coreSets.process(entries);
    expect(coreSets.getNumberOfNotOurItems()).toBe(1143);
    expect(coreSets.getNumberOfOurItems()).toBe(960);
  });
});
