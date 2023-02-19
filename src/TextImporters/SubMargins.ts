//Import TextImporter Class
import TextImporter from "./TextImporter";

class SubMarginsImporter extends TextImporter<SubMarginEntry> {
  //Set Path Of Inventory File
  textFilePath = "./Data/Inputs/subMargins.txt";
  //  invalidEntries = new Array<InventoryEntry>();
  // entries = new Map<string, InventoryEntry>();

  constructor() {
    //call TextImporter Parent Constructor
    super();
  }
  getEntryFromScanCode(scanCode: string) {
    return this.entries.get(scanCode);
  }
  getEntryFromSubDepartment(subDepartment: string) {
    return this.entries.get(subDepartment);
  }
  processLine(line: string): void {
    const values = line.split("\t");
    //Split lines into an array of values
    if (this.lineCount == 1 && values[0] == "Subcategory") {
      //       header line, don't process
    } else {
      const entry: SubMarginEntry | null = this.entryFromValueArray(values);

      if (entry != null) {
        const subDepartment = entry.subDepartment;
        if (subDepartment && !this.entries.has(subDepartment)) {
          //There is a scancode and we haven't processed it yet
          this.entries.set(subDepartment, entry);
        } else {
          //This shouldn't happen unless there are duplicate values or no scan code
          this.invalidLines.push(line);
          this.invalidEntries.push(entry);
        }
      } else {
        this.invalidLines.push(line);
      }
    }
  }

  entryFromValueArray = function (
    valueArray: Array<string>
  ): SubMarginEntry | null {
    //Based off of expected Values as outlined in
    // Data/Inputs/README.md
    if (valueArray.length === 2) {
      const entry: SubMarginEntry = {
        subDepartment: valueArray[0].trim().substring(0, 30),
        margin: valueArray[1].trim(),

        //All values as array as received
        valuesArray: valueArray,
      };
      return entry;
    }

    return null;
  };
}

export default SubMarginsImporter;

export type SubMarginEntry = {
  subDepartment: string;
  margin: string;

  valuesArray: Array<string>;
};
