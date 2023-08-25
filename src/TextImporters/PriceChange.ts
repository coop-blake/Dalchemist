/**
 * TextImporter for UNFI PriceChange report file
 * @module PriceChangeImporter
 * @category UNFI Price Change
 * @category Importer
 * @internal
 */

//Import TextImporter Class
import TextImporter from "./TextImporter";

class PriceChangeImporter extends TextImporter<PriceChangeEntry> {
  constructor(textFilePath = "./Data/Inputs/pc003116.xls") {
    //call TextImporter Parent Constructor
    super();
    this.textFilePath = textFilePath;
  }

  processLine(line: string) {
    const values = line.split("\t");
    //Split lines into an array of values
    if (this.lineCount == 1 && values[0] == "MPW #") {
      //    header line, don't process
    } else {
      const entry: PriceChangeEntry | null = this.entryFromValueArray(values);

      if (entry != null) {
        const UPC = entry.UPC;
        if (UPC && !this.entries.has(UPC)) {
          //There is a UPC and we haven't processed it yet
          this.entries.set(UPC, entry);
        } else {
          //This shouldn't happend unless there are duplicate values or no UPC code
          this.invalidLines.push(line);
          this.multipleAvailableDistributorItems.push(entry);
        }
      } else {
        this.invalidLines.push(line);
      }
    }
  }

  getEntryFromUPC(UPC: string): PriceChangeEntry | undefined {
    //convenience function for getting entry from UPC
    return this.entries.get(UPC);
  }

  entryFromValueArray = function (
    valueArray: Array<string>
  ): PriceChangeEntry | null {
    //Based off of expected Values of UNFI Pricechange file
    if (valueArray.length === 19) {
      const entry: PriceChangeEntry = {
        MPW: valueArray[0],
        PackSize: valueArray[1],
        Brand: valueArray[2],
        Description: valueArray[3],
        Status: valueArray[4],
        Dept: valueArray[5],
        ChangeDate: valueArray[6],
        Type: valueArray[7],
        UPC: String(valueArray[8]).replace(/-/g, ""),
        Taxable: valueArray[9],
        Change: valueArray[10],
        Pack: valueArray[11],
        PrevEachPrice: valueArray[12],
        PrevCasePrice: valueArray[13],
        NewEachPrice: valueArray[14],
        NewCasePrice: valueArray[15],
        SRP: valueArray[16],
        Margin: valueArray[17],

        valuesArray: valueArray,
      };
      return entry;
    } else {
      return null;
    }
  };
}

export default PriceChangeImporter;

export type PriceChangeEntry = {
  MPW: string;
  PackSize: string;
  Brand: string;
  Description: string;
  Status: string;
  Dept: string;
  ChangeDate: string;
  Type: string;
  UPC: string;
  Taxable: string;
  Change: string;
  Pack: string;
  PrevEachPrice: string;
  PrevCasePrice: string;
  NewEachPrice: string;
  NewCasePrice: string;
  SRP: string;
  Margin: string;

  valuesArray: Array<string>;
};
