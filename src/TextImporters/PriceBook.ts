/**
 * TextImporter for UNFI PriceBook file
 * @module CoreSupport
 * @category Core Support
 * @category Importer
 * @internal
 */

//Import TextImporter Class
import TextImporter from "./TextImporter";
/**
 * PriceBookTextImporter is a class that imports UNFI PriceBook files into PriceBookEntry objects.
 *
 * @class PriceBookTextImporter
 * @extends {TextImporter<PriceBookEntry>}
 */
class PriceBookTextImporter extends TextImporter<PriceBookEntry> {
  /**
   * Creates an instance of PriceBookTextImporter.
   * @param {string} [textFilePath="./Data/Inputs/pb003116.txt"] - The path to the UNFI PriceBook file.
   * @memberof PriceBookTextImporter
   */
  constructor(textFilePath = "./Data/Inputs/pb003116.txt") {
    //call TextImporter Parent Constructor
    super();
    this.textFilePath = textFilePath;
  }
  /**
   * Processes a line from the UNFI PriceBook file and adds it to the entries collection as a PriceBookEntry.
   * C
   * @param {string} line - A line from the UNFI PriceBook file.
   * @memberof PriceBookTextImporter
   */
  entriesByUPC = new Map<string, PriceBookEntry>();
  duplicatedUPCEntries = new Array<PriceBookEntry>();
  processLine(line: string) {
    const values = line.split("\t");
    //Split lines into an array of values
    if (this.lineCount == 1 && values[0] == "Dept") {
      //    header line, don't process
    } else {
      const entry: PriceBookEntry | null = this.entryFromValueArray(values);

      if (entry != null) {
        const UID = entry.supplierID;
        if (UID && !this.entries.has(UID)) {
          //There is a UPC and we haven't processed it yet
          this.entries.set(UID, entry);
        } else {
          //This shouldn't happend unless there are duplicate values or no UPC code
          // this.invalidLines.push(line);
          this.multipleAvailableDistributorItems.push(entry);
        }

        if (!this.entriesByUPC.has(entry.UPC)) {
          this.entriesByUPC.set(entry.UPC, entry);
        } else {
          this.duplicatedUPCEntries.push(entry);
        }
      } else {
        this.invalidLines.push(line);
      }
    }
  }
  /**
   * Gets the PriceBookEntry object with the specified UPC.
   *
   * @param {string} UPC - The UPC code of the desired PriceBookEntry.
   * @returns {(PriceBookEntry | undefined)} - The PriceBookEntry with the specified UPC, or undefined if it doesn't exist.
   * @memberof PriceBookTextImporter
   */
  getEntryFromUPC(UPC: string): PriceBookEntry | undefined {
    //convenience function for getting entry from UPC
    return this.entriesByUPC.get(UPC);
  }
  /**
   * Converts an array of values from a line in the UNFI PriceBook file into a PriceBookEntry.
   *
   * @param {Array<string>} valueArray - An array of values from a line in the UNFI PriceBook file.
   * @returns {(PriceBookEntry | null)} - The created PriceBookEntry or null if it was unable to be created.
   * @memberof PriceBookTextImporter
   */
  entryFromValueArray = function (
    valueArray: Array<string>
  ): PriceBookEntry | null {
    //Based off of expected Values of UNFI PriceBook file
    if (valueArray.length === 18) {
      const entry: PriceBookEntry = {
        department: valueArray[0],
        brand: valueArray[1],
        supplierID: valueArray[2],
        // uniqueID: valueArray[2],
        // uniqueID: String(valueArray[10]).replace(/-/g, ""),

        size: valueArray[3],
        flag1: valueArray[4],
        flag2: valueArray[5],
        flag3: valueArray[6],
        description: valueArray[7],
        eachPrice: valueArray[8],
        casePrice: valueArray[9],
        UPC: String(valueArray[10]).replace(/-/g, ""),
        weight: valueArray[11],
        flag4: valueArray[12],
        taxable: valueArray[13],
        MSRP: valueArray[14],
        SRP: valueArray[15],
        margin: valueArray[16],

        valuesArray: valueArray,
      };
      return entry;
    } else {
      return null;
    }
  };
}

export default PriceBookTextImporter;

/**
 * Represents an entry in a price book.
 */
export type PriceBookEntry = {
  /**
   * The department that the product belongs to.
   */
  department: string;

  /**
   * The brand of the product.
   */
  brand: string;

  /**
   * The ID of the supplier of the product.
   */
  supplierID: string;

  /**
   * The size of the product.
   */
  size: string;

  /**
   * A flag field 1.
   */
  flag1: string;

  /**
   * A flag field 2.
   */
  flag2: string;

  /**
   * A flag field 3.
   */
  flag3: string;

  /**
   * A description of the product.
   */
  description: string;

  /**
   * The price of the product, per unit.
   */
  eachPrice: string;

  /**
   * The price of the product, per case.
   */
  casePrice: string;

  /**
   * The Universal Product Code (UPC) of the product.
   */
  UPC: string;

  /**
   * The weight of the product.
   */
  weight: string;

  /**
   * A flag field 4.
   */
  flag4: string;

  /**
   * Whether the product is taxable.
   */
  taxable: string;

  /**
   * The Manufacturer's Suggested Retail Price (MSRP) of the product.
   */
  MSRP: string;

  /**
   * The Suggested Retail Price (SRP) of the product.
   */
  SRP: string;

  /**
   * The profit margin of the product.
   */
  margin: string;

  /**
   * An array of all the values in this price book entry.
   */
  valuesArray: Array<string>;
};
