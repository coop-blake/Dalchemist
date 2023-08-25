/**
 * @module Inventory
 * @category Importer
 * @internal
 */

//Import TextImporter Class
import TextImporter from "./TextImporter";

class InventoryImporter extends TextImporter<InventoryEntry> {
  //Set Path Of Inventory File
  textFilePath = "./Data/Inputs/Inventory.txt";
  //  invalidEntries = new Array<InventoryEntry>();
  // entries = new Map<string, InventoryEntry>();

  constructor() {
    //call TextImporter Parent Constructor
    super();
  }
  getEntryFromScanCode(scanCode: string) {
    return this.entries.get(scanCode);
  }

  processLine(line: string): void {
    const values = line.split("\t");
    //Split lines into an array of values
    if (
      this.lineCount == 1 &&
      (values[0] == "Scan Code" || values[0] == "inv_scancode")
    ) {
      //       header line, don't process
    } else {
      const entry: InventoryEntry | null = this.entryFromValueArray(values);

      if (entry != null) {
        const scanCode = entry.scanCode;
        if (scanCode && !this.entries.has(scanCode)) {
          //There is a scancode and we haven't processed it yet
          this.entries.set(scanCode, entry);
        } else {
          //This shouldn't happen unless there are duplicate values or no scan code
          this.invalidLines.push(line);
          this.multipleAvailableDistributorItems.push(entry);
        }
      } else {
        this.invalidLines.push(line);
      }
    }
  }

  entryFromValueArray = function (
    valueArray: Array<string>
  ): InventoryEntry | null {
    //Based off of expected Values as outlined in
    // Data/Inputs/README.md
    if (valueArray.length === 18) {
      const entry: InventoryEntry = {
        scanCode: valueArray[0].trim(),
        brand: valueArray[1].trim(),
        name: valueArray[2].trim(),
        size: valueArray[3].trim(),
        receiptAlias: valueArray[4].trim(),
        invDiscontinued: valueArray[5].trim(),
        subdepartment: valueArray[6].trim(),
        storeNumber: valueArray[7].trim(),
        department: valueArray[8].trim(),
        supplierUnitID: valueArray[9].trim(),
        basePrice: valueArray[10].trim(),
        quantity: valueArray[11].trim(),
        lastCost: valueArray[12].trim(),
        averageCost: valueArray[13].trim(),
        idealMargin: valueArray[14].trim(),
        defaultSupplier: valueArray[15].trim(),
        unit: valueArray[16].trim(),
        southLastSoldDate: valueArray[17].trim(),

        //All values as array as received
        valuesArray: valueArray,
      };
      return entry;
    }

    return null;
  };
}

export default InventoryImporter;

export type InventoryEntry = {
  scanCode: string;
  brand: string;
  name: string;
  size: string;
  receiptAlias: string;
  invDiscontinued: string;
  subdepartment: string;
  storeNumber: string;
  department: string;
  supplierUnitID: string;
  basePrice: string;
  quantity: string;
  lastCost: string;
  averageCost: string;
  idealMargin: string;
  defaultSupplier: string;
  unit: string;
  southLastSoldDate: string;

  valuesArray: Array<string>;
};
