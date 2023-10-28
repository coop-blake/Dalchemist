import { describe, expect, test } from "@jest/globals";
import { InventorySheetReader } from "../../src/Resources/Inventory/Sheet";

describe("InventorySheet", () => {
  test("Should read inventory sheet", async () => {
    const entries = await new InventorySheetReader().read();
    expect(entries.length).toBeGreaterThan(0);
  });
});
