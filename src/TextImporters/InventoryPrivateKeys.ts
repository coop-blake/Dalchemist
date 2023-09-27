//Import TextImporter Class
import TextImporter from "./TextImporter";

class InventoryPrivateKeysImporter extends TextImporter<InventoryPrivateKeyEntry> {
  //Set Path Of Inventory File
  textFilePath = "";

  multipleItems = new Array<InventoryPrivateKeyEntry>();
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
    if (this.lineCount == 1 && values[0] == "ScanCode") {
      //       header line, don't process
    } else {
      const entry: InventoryPrivateKeyEntry | null =
        this.entryFromValueArray(values);

      if (entry != null) {
        const privateKey = entry.privateKey;
        if (privateKey && !this.entries.has(privateKey)) {
          //There is a scancode and we haven't processed it yet
          this.entries.set(privateKey, entry);
        } else {
          //This shouldn't happen unless there are duplicate values or no scan code
          this.invalidLines.push(line);
          this.multipleItems.push(entry);
        }
      } else {
        this.invalidLines.push(line);
      }
    }
  }

  entryFromValueArray = function (
    valueArray: Array<string>
  ): InventoryPrivateKeyEntry | null {
    //Based off of expected Values as outlined in
    // Data/Inputs/README.md
    if (valueArray.length === 2) {
      const entry: InventoryPrivateKeyEntry = {
        scanCode: valueArray[0].trim(),
        privateKey: valueArray[1].trim(),

        //All values as array as received
        valuesArray: valueArray,
      };
      return entry;
    }

    return null;
  };

  getScanCodeFromPrivateKey(privateKey: string): string {
    return this.entries.get(privateKey)?.scanCode ?? "";
  }
}

export default InventoryPrivateKeysImporter;

export type InventoryPrivateKeyEntry = {
  scanCode: string;
  privateKey: string;

  valuesArray: Array<string>;
};
