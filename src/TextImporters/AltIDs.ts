//Import TextImporter Class
import TextImporter from "./TextImporter";

class AltIDsImporter extends TextImporter<AltIDImportEntry> {
  //Set Path Of Inventory File
  textFilePath = "";

  multipleItems = new Array<AltIDImportEntry>();
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
    if (this.lineCount == 1) {
      //       header line, don't process
    } else {
      const entry: AltIDImportEntry | null = this.entryFromValueArray(values);

      if (entry != null) {
        const privateKey = entry.privateKey;
        if (privateKey && !this.entries.has(privateKey)) {
          //There is a scancode and we haven't processed it yet
          this.entries.set(privateKey, entry);
        } else {
          //This shouldn't happen unless there are duplicate values or no scan code
          this.invalidLines.push(line);
          this.multipleItems.push(entry);
          this.entries.set("DUP" + this.lineCount + ":" + privateKey, entry);
        }
      } else {
        this.invalidLines.push(line);
      }
    }
  }

  entryFromValueArray = function (
    valueArray: Array<string>
  ): AltIDImportEntry | null {
    //Based off of expected Values as outlined in
    // Data/Inputs/README.md
    if (valueArray.length === 3) {
      const entry: AltIDImportEntry = {
        privateKey: valueArray[0].trim(),
        scanCode: valueArray[1].trim(),
        quantity: valueArray[2].trim(),
        parentKey: "",

        //All values as array as received
        valuesArray: valueArray,
      };
      return entry;
    }

    return null;
  };
}

export default AltIDsImporter;

export type AltIDImportEntry = {
  privateKey: string;
  scanCode: string;
  quantity: string;
  parentKey: string;

  valuesArray: Array<string>;
};
