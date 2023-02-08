import InventoryTextImporter, {
  InventoryEntry,
} from "../TextImporters/Inventory";
import PricebookTextImporter from "../TextImporters/Pricebook";

class PriceChecker {
  InventoryImport = new InventoryTextImporter();
  PricebookImport = new PricebookTextImporter();

  InventoryItemsInPricebook = Array<InventoryEntry>();
  InventoryItemsInPricebookWithUNFIDefaultSupplier = Array<InventoryEntry>();
  sameCost = Array<InventoryEntry>();
  lowerCost = Array<InventoryEntry>();
  higherCost = Array<InventoryEntry>();

  async initialize() {
    await this.InventoryImport.start();
    await this.PricebookImport.start();

    const InventoryImport = this.InventoryImport;
    const PricebookImport = this.PricebookImport;

    this.InventoryItemsInPricebook = [
      ...InventoryImport.entries.values(),
    ].filter(function (InventoryEntry) {
      const scanCode = InventoryEntry.scanCode;
      const PricebookEntry = PricebookImport.getEntryFromUPC(scanCode);
      return PricebookEntry ? true : false;
    });

    this.InventoryItemsInPricebookWithUNFIDefaultSupplier =
      this.InventoryItemsInPricebook.filter(function (entry) {
        return entry.defaultSupplier == "UNFI" ? true : false;
      });

    this.sameCost =
      this.InventoryItemsInPricebookWithUNFIDefaultSupplier.filter(function (
        entry
      ) {
        const scanCode = entry.scanCode;
        const PricebookEntry = PricebookImport.getEntryFromUPC(scanCode);

        return PricebookEntry !== undefined &&
          parseFloat(entry.lastCost) == parseFloat(PricebookEntry.eachPrice)
          ? true
          : false;
      });

    this.lowerCost =
      this.InventoryItemsInPricebookWithUNFIDefaultSupplier.filter(function (
        entry
      ) {
        const scanCode = entry.scanCode;
        const PricebookEntry = PricebookImport.getEntryFromUPC(scanCode);

        return PricebookEntry !== undefined &&
          parseFloat(entry.lastCost) < parseFloat(PricebookEntry.eachPrice)
          ? true
          : false;
      });

    this.higherCost =
      this.InventoryItemsInPricebookWithUNFIDefaultSupplier.filter(function (
        entry
      ) {
        const scanCode = entry.scanCode;
        const PricebookEntry = PricebookImport.getEntryFromUPC(scanCode);

        return PricebookEntry !== undefined &&
          parseFloat(entry.lastCost) > parseFloat(PricebookEntry.eachPrice)
          ? true
          : false;
      });
  }

  getLowerCostOutput() {
    let outputText =
      "Scan Code\tLast Cost\tUNFI Cost \tIdeal Margin\tProposed Price \tBase Price\tDifference\tItem\t\r\n";
    const lowerCostItems = this.lowerCost;
    const PricebookImport = this.PricebookImport;

    lowerCostItems.forEach(function (entry) {
      const scanCode = entry.scanCode;

      const PricebookEntry = PricebookImport.getEntryFromUPC(scanCode);

      const proposedPriceFromUNFI: number =
        PricebookEntry !== undefined && entry !== undefined
          ? parseFloat(PricebookEntry.eachPrice) /
            (1 - parseFloat(entry.idealMargin) * 0.01)
          : 0;

      outputText =
        PricebookEntry !== undefined && entry !== undefined
          ? outputText +
            `${entry.scanCode}\t${parseFloat(entry.lastCost)}\t${parseFloat(
              PricebookEntry.eachPrice
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
