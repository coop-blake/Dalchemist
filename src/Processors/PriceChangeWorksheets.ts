/**
 * @class PriceChangeWorksheets
 * @module PriceChangeWorksheets
 * @category Processors
 * @internal
 */

// Importer for price change worksheets
// creates TextImport for each worksheet in input directory
// Loads each data line of worksheet as an entry
import PriceChangeWorksheetImporter from "../TextImporters/PriceChangeWorksheet";
import * as fs from "node:fs/promises";
/**
 * @class PriceChangeWorksheets
 * @category Processors
 */
export default class PriceChangeWorksheets {
  lineCount = 0;
  //Set the path to the Price Change Worksheets Input Directory
  worksheetsDirectory = "./Data/Inputs/Price Change Worksheets/";
  //Create empty array of worksheets
  priceChangeWorksheets = new Array<PriceChangeWorksheetImporter>();

  async initialize() {
    //Load all worksheets
    await this.loadWorksheets();
  }

  async loadWorksheets() {
    //Cycle through Price Change Worksheets Directory
    //and attempt to load each file found as a price change worksheet
    try {
      const worksheetFiles = await fs.readdir(this.worksheetsDirectory);
      for (const worksheetFile of worksheetFiles) {
        await this.loadWorksheet(worksheetFile);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async loadWorksheet(fileName: string) {
    // Create new text import for worksheet
    const newWorksheetImporter = new PriceChangeWorksheetImporter(
      this.worksheetsDirectory + fileName
    );
    //Set Filename and textFilePath
    // newWorksheetImporter.fileName = fileName;
    // newWorksheetImporter.textFilePath = this.worksheetsDirectory + fileName;

    //Create empty processedValues Object

    //Start reading and processing the file
    await newWorksheetImporter.start();
    //Add the worksheet to the array
    this.priceChangeWorksheets.push(newWorksheetImporter);
  }

  forEachWorksheet(
    forEachFunction: (worksheet: PriceChangeWorksheetImporter) => void
  ) {
    //convienince function for executing a function on each worksheet
    this.priceChangeWorksheets.forEach((priceChangeWorksheet) => {
      forEachFunction(priceChangeWorksheet);
    });
  }
}
