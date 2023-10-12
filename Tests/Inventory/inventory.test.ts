import { describe, expect, test, beforeAll } from "@jest/globals";

import {
  Inventory,
  InventoryStatus
} from "../../src/Resources/Inventory/Inventory";

const inventory = new Inventory();

beforeAll(async () => {});
describe("Inventory exists correctly", () => {
  test(`Should be Inventory class`, async () => {
    expect(inventory).toBeInstanceOf(Inventory);
  });

  test(`Should be able to get Inventory Status`, async () => {
    expect(inventory.getStatus()).toBeInstanceOf(InventoryStatus);
  });
});

describe("Inventory works correctly ", () => {
  test(`Should become Available`, async () => {
    expect(inventory).toBeInstanceOf(Inventory);
  });

  test(`Should be able to get Inventory`, async () => {
    expect(inventory.getStatus()).toBeInstanceOf(InventoryStatus);
  });
});
