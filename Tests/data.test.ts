import { describe, expect, test } from "@jest/globals";
import * as fs from "fs";

describe("Data Directory Present and Complete", () => {
  test("Data Directory Present ", () => {
    expect(fs.existsSync(`./Data/`)).toBe(true);
  });

  test("Price Change Worksheet Folder Present", () => {
    expect(fs.existsSync(`./Data/Inputs/Price Change Worksheets/`)).toBe(true);
  });

  test("Inventory File Present", () => {
    expect(fs.existsSync(`./Data/Inputs/Inventory.txt`)).toBe(true);
  });
});
