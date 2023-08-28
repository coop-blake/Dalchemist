/**
 * TextImporter for Catapult Price Change Worksheet export file
 * @module PriceChangeWorksheetImporter
 * @category Utility
 * @category Importer
 * @internal
 */

//TextImporter for UNFI PriceBook file
//Import TextImporter Class
import TextImporter from "./TextImporter";

class PriceChangeWorksheetImporter extends TextImporter<PriceChangeWorksheetEntry> {
  //Set Path Of PriceBook File
  textFilePath = "";
  //Create empty Object for storing processed Values
  //invalidEntries = new Array<PriceChangeWorksheetEntry>();
  //entries = new Map<string, PriceChangeWorksheetEntry>();

  constructor(textFilePath: string) {
    //call TextImporter Parent Constructor
    super();

    this.textFilePath = textFilePath;
  }

  processLine(line: string) {
    //todo put this in priceChangeWorksheet class
    switch (this.lineCount) {
      case 1:
        //First line
        if (line.trim() != "Price Change") {
          throw `First line of worksheet not expected: ${line}`;
        }
        break;
      case 2:
        //second line
        if (line.trim() != "[WORKSHEETINFO]") {
          throw `Second line of worksheet not expected: ${line}`;
        }
        break;
      case 3:
        {
          //third line
         // const values = line.split("\t");
          //  this.worksheetStartDate = new Date(values[1]);
          //  this.worksheetEndDate = new Date(values[2]);
        }
        break;
      case 4:
        //fourth line
        if (line.trim() != "[Records]") {
          throw `Fourth line of worksheet not expected: ${line}`;
        }
        break;
      default: {
        //Past header lines, proccess values
        const values = line.split("\t");
        const entry = this.entryFromValueArray(values);
        this.entries.set(entry.scanCode, entry);
      }
    }
  }

  forEachEntry(functionToCall: (entry: PriceChangeWorksheetEntry) => void) {
    this.entries.forEach((entry: PriceChangeWorksheetEntry) => {
      functionToCall(entry);
    });
  }

  entryFromValueArray = function (
    valueArray: Array<string>
  ): PriceChangeWorksheetEntry {
    {
      //Creates an entry from the value array
      const entry: PriceChangeWorksheetEntry = {
        scanCode: valueArray[0].trim(),
        receiptAlias:
          valueArray[1] && valueArray[1].trim()
            ? valueArray[1].trim()
            : "NO ALIAS!",
        modifiedPrice:
          valueArray[6] && valueArray[6].trim()
            ? parseFloat(valueArray[6].trim()).toFixed(2)
            : "0",
      };
      if (entry.receiptAlias == "NO ALIAS!") {
        console.log("NO ALIAS! \n");
      }
      return entry;
    }
  };
}

export type PriceChangeWorksheetEntry = {
  scanCode: string;
  receiptAlias: string;
  modifiedPrice: string;
};

export default PriceChangeWorksheetImporter;
