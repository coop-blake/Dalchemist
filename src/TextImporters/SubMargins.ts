/**
 *
 * ### Inputs
 *       subMargins.txt
 *
 * ### Import Specifics
 * Reads data in subMargins.txt, expecting the SUBDEPARTMENT Powerfield Name as the first coulumn and the margin percentage represented as an integer between 0 and 100 in the second column.
 *
 * This importer truncates the value in the first column to 30 characters to match the actual values in the database. After being truncated, the values in the first column (SUBDEPARTMENT) should be unique. Duplicates will be placed in the invalidLines Array.
 *
 *
 *
 * @module SubcategoryMargins
 * @internal
 * @category Importer
 * @example
 * //import SubcategoryMargins
 * import SubMarginsImporter from "./TextImporters/SubMargins";
 * //Create a new import instance
 * const SubMarginsImport = new SubMarginsImporter();
 * //Read the subMargins.txt file into memory and proccess lines
 * await SubMarginsImport.start();
 * //Get the expected margin of a SUBDEPARTMENT
 * const expectedMargin = SubMarginsImport.getEntryFromSubDepartment("910 POWDERED MEAL REPLACEMENTS")?.margin;
 */
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
          this.multipleAvailableDistributorItems.push(entry);
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
        subDepartment: valueArray[0].trim().substring(0, 30).trim(),
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
