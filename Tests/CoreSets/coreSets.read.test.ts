import { describe, expect, test } from "@jest/globals";

import { CoreSets } from "../../src/Resources/CoreSets/CoreSets";

const coreSets = new CoreSets();
describe("Read Sample Core Sets File", () => {
  test("Should return some entries", async () => {
    const entries = await coreSets.read("Data/Inputs/CoreSets.xlsx");
    expect(entries.length).toBeGreaterThan(0);
  });
});
