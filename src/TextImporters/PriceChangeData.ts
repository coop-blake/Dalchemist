//Import TextImporter Class
import TextImporter from "./TextImporter";

class PriceChangeDataImporter extends TextImporter<PriceChangeDataImportEntry> {
  //Set Path Of Inventory File
  textFilePath = "";

  multipleItems = new Array<PriceChangeDataImportEntry>();
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
      const entry: PriceChangeDataImportEntry | null = this.entryFromValueArray(values);

      if (entry != null) {
       
          this.entries.set("Line:" + this.lineCount + ":", entry);
        
      } else {
        this.invalidLines.push(line);
      }
    }
  }

  entryFromValueArray = function (
    valueArray: Array<string>
  ): PriceChangeDataImportEntry | null {
    //Based off of expected Values as outlined in
    // Data/Inputs/README.md
    if (valueArray.length === 6) {
      const entry: PriceChangeDataImportEntry = {
        scanCode: valueArray[0].trim(),
        price: parseFloat(valueArray[1].trim()).toFixed(2),
        discount: valueArray[2].trim(),
        worksheet: valueArray[3].trim(),
        startDate: valueArray[4].trim(),
        endDate: valueArray[5].trim(),

        //All values as array as received
        valuesArray: valueArray,
      };
      return entry;
    }

    return null;
  };
}

export default PriceChangeDataImporter;

export type PriceChangeDataImportEntry = {
  scanCode: string;
  price: string;
  discount: string;
  worksheet: string;
  startDate: string;
  endDate: string;
  valuesArray: Array<string>;
};
