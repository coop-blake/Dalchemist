//TextImporter for UNFI Pricebook file
//Import TextImporter Class
import TextImporter from "./TextImporter.js";

class PricebookTextImporter extends TextImporter {
  //Set Path Of Pricebook File
  textFilePath = "./Data/Inputs/pb003116.txt";
  //Create empty Object for storing processed Values
  invalidEntries = new Array<PriceBookEntry>();
  entries = new Map<string, PriceBookEntry>();
  constructor() {
    //call TextImporter Parent Constructor
    super();
  }

  processLine(line: string) {
    const values = line.split("\t");
    //Split lines into an array of values
    if (this.lineCount == 1 && values[0] == "Dept") {
      //    header line, don't process
    } else {
      const entry: PriceBookEntry | null = this.entryFromValueArray(values);

      if (entry != null) {
        const UPC = entry.UPC;
        if (UPC && !this.entries.has(UPC)) {
          //There is a UPC and we haven't processed it yet
          this.entries.set(UPC, entry);
        } else {
          //This shouldn't happend unless there are duplicate values or no UPC code
          this.invalidLines.push(line);
          this.invalidEntries.push(entry);
        }
      } else {
        this.invalidLines.push(line);
      }
    }
  }

  getEntryFromUPC(UPC: string): PriceBookEntry | undefined {
    //convenience function for getting entry from UPC
    return this.entries.get(UPC);
  }

  entryFromValueArray = function (
    valueArray: Array<string>
  ): PriceBookEntry | null {
    //Based off of expected Values of UNFI Pricebook file
    if (valueArray.length === 17) {
      const entry: PriceBookEntry = {
        department: valueArray[0],
        brand: valueArray[1],
        supplierID: valueArray[2],
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

export default PricebookTextImporter;

type PriceBookEntry = {
  department: string;
  brand: string;
  supplierID: string;
  size: string;
  flag1: string;
  flag2: string;
  flag3: string;
  description: string;
  eachPrice: string;
  casePrice: string;
  UPC: string;
  weight: string;
  flag4: string;
  taxable: string;
  MSRP: string;
  SRP: string;
  margin: string;

  valuesArray: Array<string>;
};
