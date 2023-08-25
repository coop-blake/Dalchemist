/**
 * Imports and combines data from Inventory and UNFI PriceChange files, and provides methods to work with the data.
 *
 * @module PriceChangeInventoryUpdate
 * @category UNFI Price Change
 * @category Processor
 * @internal
 */

import InventoryImporter, { InventoryEntry } from "../TextImporters/Inventory";
import PriceChangeImporter, {
  PriceChangeEntry,
} from "../TextImporters/PriceChange";

//Create new Import objects
const inventoryImport = new InventoryImporter();
const priceChangeImportNorth = new PriceChangeImporter();
const priceChangeImportSouth = new PriceChangeImporter(
  "./Data/Inputs/pc018620.xls"
);

/**
 * A map of combined Price Change entries.
 */
const combinedPriceChangeEntries = new Map<string, PriceChangeEntry>();
/**
 * A map of combined Price Change entries.
 */
const duplicatePriceChangeEntries = new Map<
  string,
  [PriceChangeEntry, PriceChangeEntry]
>();
/**
 * A map of Price Change entries with the same UPC but different values.
 */
const duplicatedDifferentPriceChangeEntries = new Map<
  string,
  [PriceChangeEntry, PriceChangeEntry]
>();
/**
 * A map of Price Change and Inventory entries that match by UPC or Supplier ID.
 */
const checkedPriceChangeEntries = new Map<
  string,
  [PriceChangeEntry, InventoryEntry]
>();
/**
 * A map of Price Change and Inventory entries that match by Supplier ID but not UPC.
 */
const supplierFoundPriceChangeEntries = new Map<
  string,
  [PriceChangeEntry, InventoryEntry]
>();
/**
 * A map of Price Change entries with UPCs not found in Inventory.
 */
const notFoundPriceChangeEntries = new Map<string, PriceChangeEntry>();
/**
 * A map of Inventory entries with UNFI as default supplier.
 */
const inventoryUNFIItems = new Map<string, InventoryEntry>();
/**
 * The `PriceChangeInventoryUpdate` class provides methods to import and work with data from Inventory and PriceChange files.
 * @class PriceChangeInventoryUpdate
 */
export default class PriceChangeInventoryUpdate {
  /**
   * Initializes the `PriceChangeInventoryUpdate` object by importing data from Inventory and PriceChange files.
   */
  async initialize() {
    await inventoryImport.start();
    await priceChangeImportNorth.start();
    await priceChangeImportSouth.start();

    priceChangeImportNorth.forEachEntry((entry) => {
      combinedPriceChangeEntries.set(entry.UPC, entry);
    });

    priceChangeImportSouth.forEachEntry((entry) => {
      const existingEntry = combinedPriceChangeEntries.get(entry.UPC);

      if (!existingEntry) {
        combinedPriceChangeEntries.set(entry.UPC, entry);
      } else {
        duplicatePriceChangeEntries.set(entry.UPC, [existingEntry, entry]);
        //check that the entries are the same
        const existingEntryString = existingEntry.valuesArray.join(" ");
        const entryString = entry.valuesArray.join(" ");
        if (existingEntryString.valueOf() !== entryString.valueOf()) {
          duplicatedDifferentPriceChangeEntries.set(entry.UPC, [
            existingEntry,
            entry,
          ]);
        }
      }
    });

    inventoryImport.forEachEntry((entry) => {
      if (entry.defaultSupplier.valueOf() === "UNFI".valueOf()) {
        inventoryUNFIItems.set(entry.supplierUnitID, entry);
      }
    });

    [...combinedPriceChangeEntries.values()].forEach((entry) => {
      let inventoryEntry = inventoryImport.getEntryFromScanCode(entry.UPC);

      if (inventoryEntry) {
        checkedPriceChangeEntries.set(entry.UPC, [entry, inventoryEntry]);
      } else {
        inventoryEntry = inventoryUNFIItems.get(entry.MPW);

        if (inventoryEntry) {
          checkedPriceChangeEntries.set(inventoryEntry.scanCode, [
            entry,
            inventoryEntry,
          ]);
          supplierFoundPriceChangeEntries.set(inventoryEntry.scanCode, [
            entry,
            inventoryEntry,
          ]);
        } else {
          notFoundPriceChangeEntries.set(entry.UPC, entry);
        }
      }
    });
  }

  getSupplierFoundPriceChangeEntries() {
    return supplierFoundPriceChangeEntries;
  }
  getCombinedPriceChangeEntries() {
    return combinedPriceChangeEntries;
  }
  getCheckedPriceChangeEntries() {
    return checkedPriceChangeEntries;
  }
  getNotFoundPriceChangeEntries() {
    return notFoundPriceChangeEntries;
  }
  getDuplicatePriceChangeEntriesTextReport(): string {
    let returnText = "";
    [...duplicatePriceChangeEntries.values()].forEach((entries) => {
      returnText +=
        "##########################################################\n";
      returnText += `${entries[0].valuesArray.join(" ")}\n`;
      returnText += `${entries[1].valuesArray.join(" ")}\n`;
    });
    return returnText;
  }

  getDuplicatedDifferentPriceChangeEntriesTextReport(): string {
    let returnText =
      "##################################################################################\n";

    [...duplicatedDifferentPriceChangeEntries.values()].forEach((entries) => {
      returnText += "\n";
      returnText += `${entries[0].valuesArray.join(" ")}\n`;
      returnText += `${entries[1].valuesArray.join(" ")}\n`;
    });
    return returnText;
  }

  getCombinedEntries() {
    return [...combinedPriceChangeEntries.values()];
  }

  getDuplicateEntries() {
    return [...duplicatePriceChangeEntries.values()];
  }

  getDuplicatedDifferentEntries() {
    return [...duplicatedDifferentPriceChangeEntries.values()];
  }

  getNorthImporter(): PriceChangeImporter {
    return priceChangeImportNorth;
  }

  getSouthImporter(): PriceChangeImporter {
    return priceChangeImportSouth;
  }

  getInventoryImporter(): InventoryImporter {
    return inventoryImport;
  }
}
