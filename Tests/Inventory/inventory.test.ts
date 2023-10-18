import { describe, expect, test, beforeAll } from "@jest/globals";
import { first } from "rxjs";
import { Inventory } from "../../src/Resources/Inventory/Inventory";
import { Status as InventoryStatus } from "../../src/Resources/Inventory/shared";
const inventory = new Inventory();

beforeAll(async () => {
  //Get the Inventory State and wait until status becomes available
  const state = inventory.getState();
  const availablePromise = new Promise<void>((resolve) => {
    state.status$
      .pipe(
        first((newStatus) => {
          return newStatus === InventoryStatus.Available;
        })
      )
      .subscribe(() => {
        resolve();
      });
  });

  await availablePromise;
});
describe("Inventory exists correctly", () => {
  test(`Should be Inventory class`, async () => {
    expect(inventory).toBeInstanceOf(Inventory);
  }, 10000);
});

describe("Inventory works correctly ", () => {
  test(`Should be able to get Inventory Entries`, async () => {
    const entries = inventory.getEntries();
    expect(entries.size).toBeGreaterThanOrEqual(0);
  }, 10000);
});
