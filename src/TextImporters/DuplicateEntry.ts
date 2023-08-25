/**
 * @module DuplicateEntry
 * @category Importer
 * @internal
 */

import TextImporter from "../TextImporters/TextImporter";

//Create new Import object

class DuplicateEntry extends TextImporter<DupCheckEntry> {
  //Set Path Of Inventory File
  textFilePath = "./Data/Inputs/CheckForDups.txt";
  //invalidEntries = new Array<DupCheckEntry>();
  //entries = new Map<string, DupCheckEntry>();

  dupEntries = new Map<string, Array<DupCheckEntry>>();

  constructor() {
    //call TextImporter Parent Constructor
    super();
  }

  processLine = (line: string) => {
    const values = line.split("\t");
    //Split lines into an array of values

    const entry = this.entryFromValueArray(values);
    const scanCode = entry?.scanCode;
    if (scanCode && !this.entries.get(scanCode)) {
      //There is a scancode and we haven't processed it yet
      this.entries.set(scanCode, entry);
    } else {
      //Already Proccessed this scanCode
      //push to duplicate entries list
      const scanCodeDupList =
        this.dupEntries.get(scanCode) || Array<DupCheckEntry>();

      scanCodeDupList.push(entry);
      this.dupEntries.set(scanCode, scanCodeDupList);
    }
  };

  entryFromValueArray = function (valueArray: Array<string>): DupCheckEntry {
    //Based off of expected Values as outlined in
    // Data/Inputs/README.md
    const entry: DupCheckEntry = {
      scanCode: valueArray[0].trim(),
      price: valueArray[1].trim(),
      //All values as array as received
      valuesArray: valueArray,
    };

    return entry;
  };
}

export default DuplicateEntry;

export type DupCheckEntry = {
  scanCode: string;
  price: string;

  valuesArray: Array<string>;
};
