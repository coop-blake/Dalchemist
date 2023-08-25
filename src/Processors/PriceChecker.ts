/**
 * @module PriceChecker
 * @category Price Checks
 * @internal
 */

import InventoryImporter, { InventoryEntry } from "../TextImporters/Inventory";
import PriceBookTextImporter from "../TextImporters/PriceBook";

class PriceChecker {
  InventoryImport = new InventoryImporter();
  PriceBookImport = new PriceBookTextImporter();

  InventoryItemsInPriceBook = Array<InventoryEntry>();
  InventoryItemsInPriceBookWithUNFIDefaultSupplier = Array<InventoryEntry>();
  sameCost = Array<InventoryEntry>();
  lowerCost = Array<InventoryEntry>();
  higherCost = Array<InventoryEntry>();

  async initialize() {
    await this.InventoryImport.start();
    await this.PriceBookImport.start();

    const InventoryImport = this.InventoryImport;
    const PriceBookImport = this.PriceBookImport;

    this.InventoryItemsInPriceBook = [
      ...InventoryImport.entries.values(),
    ].filter(function (InventoryEntry) {
      const scanCode = InventoryEntry.scanCode;
      const PriceBookEntry = PriceBookImport.getEntryFromUPC(scanCode);
      return PriceBookEntry ? true : false;
    });

    this.InventoryItemsInPriceBookWithUNFIDefaultSupplier =
      this.InventoryItemsInPriceBook.filter(function (entry) {
        return entry.defaultSupplier == "UNFI" ? true : false;
      });

    this.sameCost =
      this.InventoryItemsInPriceBookWithUNFIDefaultSupplier.filter(function (
        entry
      ) {
        const scanCode = entry.scanCode;
        const PriceBookEntry = PriceBookImport.getEntryFromUPC(scanCode);

        return PriceBookEntry !== undefined &&
          parseFloat(entry.lastCost) == parseFloat(PriceBookEntry.eachPrice)
          ? true
          : false;
      });

    this.lowerCost =
      this.InventoryItemsInPriceBookWithUNFIDefaultSupplier.filter(function (
        entry
      ) {
        const scanCode = entry.scanCode;
        const PriceBookEntry = PriceBookImport.getEntryFromUPC(scanCode);

        return PriceBookEntry !== undefined &&
          parseFloat(entry.lastCost) < parseFloat(PriceBookEntry.eachPrice)
          ? true
          : false;
      });

    this.higherCost =
      this.InventoryItemsInPriceBookWithUNFIDefaultSupplier.filter(function (
        entry
      ) {
        const scanCode = entry.scanCode;
        const PriceBookEntry = PriceBookImport.getEntryFromUPC(scanCode);

        return PriceBookEntry !== undefined &&
          parseFloat(entry.lastCost) > parseFloat(PriceBookEntry.eachPrice)
          ? true
          : false;
      });
  }

  getLowerCostOutput() {
    let outputText =
      "Scan Code\tLast Cost\tUNFI Cost \tIdeal Margin\tProposed Price \tBase Price\tDifference\tItem\t\r\n";
    const lowerCostItems = this.lowerCost;
    const PriceBookImport = this.PriceBookImport;

    lowerCostItems.forEach(function (entry) {
      const scanCode = entry.scanCode;

      const PriceBookEntry = PriceBookImport.getEntryFromUPC(scanCode);

      const proposedPriceFromUNFI: number =
        PriceBookEntry !== undefined && entry !== undefined
          ? parseFloat(PriceBookEntry.eachPrice) /
            (1 - parseFloat(entry.idealMargin) * 0.01)
          : 0;

      outputText =
        PriceBookEntry !== undefined && entry !== undefined
          ? outputText +
            `${entry.scanCode}\t${parseFloat(entry.lastCost)}\t${parseFloat(
              PriceBookEntry.eachPrice
            )}\t${entry.idealMargin}\t${proposedPriceFromUNFI.toFixed(2)}\t${
              entry.basePrice
            }\t${(parseFloat(entry.basePrice) - proposedPriceFromUNFI).toFixed(
              2
            )}\t${entry.brand + " " + entry.name}\t\r\n`
          : outputText;
    });
    return outputText;
  }
}

export default PriceChecker;
