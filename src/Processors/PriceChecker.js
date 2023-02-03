import InventoryTextImporter from "../src/TextImporters/Inventory.js";
import PricebookTextImporter from "../src/TextImporters/Pricebook.js";

class PriceChecker {
  InventoryImport = new InventoryTextImporter();
  PricebookImport = new PricebookTextImporter();

  InventoryItemsInPricebook = [];
  InventoryItemsInPricebookWithUNFIDefaultSupplier;
  sameCost;
  lowerCost;
  higherCost;

  async initialize() {
    await this.InventoryImport.start();
    await this.PricebookImport.start();

    let InventoryImport = this.InventoryImport;
    let PricebookImport = this.PricebookImport;

    let InventoryItemsInPricebook = Object.entries(
      InventoryImport.processedValues
    ).filter(function (InventoryEntry) {
      let scanCode = InventoryEntry[1].scanCode;
      let PricebookEntry = PricebookImport.getEntryFromUPC(scanCode);

      return PricebookEntry ? true : false;
    });

    //filter Items in both files
    this.InventoryItemsInPricebook = InventoryItemsInPricebook.map(function (
      entry
    ) {
      return entry[1];
    });
    this.InventoryItemsInPricebookWithUNFIDefaultSupplier =
      this.InventoryItemsInPricebook.filter(function (entry) {
        return entry.defaultSupplier == "UNFI" ? true : false;
      });

    this.sameCost =
      this.InventoryItemsInPricebookWithUNFIDefaultSupplier.filter(function (
        entry
      ) {
        let scanCode = entry.scanCode;
        let PricebookEntry = PricebookImport.getEntryFromUPC(scanCode);

        return parseFloat(entry.lastCost) ==
          parseFloat(PricebookEntry.eachPrice)
          ? true
          : false;
      });

    this.lowerCost =
      this.InventoryItemsInPricebookWithUNFIDefaultSupplier.filter(function (
        entry
      ) {
        let scanCode = entry.scanCode;
        let PricebookEntry = PricebookImport.getEntryFromUPC(scanCode);

        return parseFloat(entry.lastCost) < parseFloat(PricebookEntry.eachPrice)
          ? true
          : false;
      });

    this.higherCost =
      this.InventoryItemsInPricebookWithUNFIDefaultSupplier.filter(function (
        entry
      ) {
        let scanCode = entry.scanCode;
        let PricebookEntry = PricebookImport.getEntryFromUPC(scanCode);

        return parseFloat(entry.lastCost) > parseFloat(PricebookEntry.eachPrice)
          ? true
          : false;
      });
  }

  getLowerCostOutput() {
    let outputText =
      "Scan Code\tLast Cost\tUNFI Cost \tIdeal Margin\tProposed Price \tBase Price\tDifference\tItem\t\r\n";
    let lowerCostItems = this.lowerCost;
    let PricebookImport = this.PricebookImport;

    lowerCostItems.forEach(function (entry) {
      let scanCode = entry.scanCode;

      let PricebookEntry = PricebookImport.getEntryFromUPC(scanCode);

      let proposedPriceFromUNFI =
        parseFloat(PricebookEntry.eachPrice) / (1 - entry.idealMargin * 0.01);

      outputText =
        outputText +
        `${entry.scanCode}\t${parseFloat(entry.lastCost)}\t${parseFloat(
          PricebookEntry.eachPrice
        )}\t${entry.idealMargin}\t${parseFloat(proposedPriceFromUNFI).toFixed(
          2
        )}\t${entry.basePrice}\t${parseFloat(
          entry.basePrice - proposedPriceFromUNFI
        ).toFixed(2)}\t${entry.brand + " " + entry.name}\t\r\n`;
    });
    return outputText;
  }
}

export default PriceChecker;
