/**
 * @module CoreSupport
 * @category Core Support
 * @category Processor
 * @internal
 */
import { CoreSupportEntry } from "./shared";

import { Inventory } from "../../Google/Inventory/Inventory";

import Settings from "../Settings";

import TextImporter from "../../TextImporters/TextImporter";

import xlsx from "node-xlsx";
import { stat } from "fs/promises";
import { existsSync } from "fs";

export class CoreSupport extends TextImporter<CoreSupportEntry> {
  lineCount = 0;
  filePath = "";

  notOurWarehouse = new Array<CoreSupportEntry>();

  ourCoreItems = new Map<string, CoreSupportEntry>();

  async loadCoreSetsExcelFile() {
    const filePath = await Settings.getCoreSetsExcelFilePath();
    console.log(filePath);
    if (filePath && filePath.length > 0) {
      this.filePath = filePath;
      await this.start();
      return Date.now();
    } else {
      console.log("Failed to select file", filePath);
      return 0;
    }
  }

  public async selectFilePath() {
    const filePath = await Settings.selectCoreSetsLocation();
    console.log(filePath);
    if (filePath && filePath.length > 0) {
      this.filePath = filePath;
      return filePath;
    } else {
      console.log("Failed to select file", filePath);
      return "";
    }
  }

  public getFilePath() {
    return Settings.getCoreSetsExcelFilePath();
  }

  public doesKnownFileExist(): boolean {
    return Settings.doesCoreSetsExcelFileLocationExist();
  }
  async start() {
    try {
      // await inventoryImport.start();

      const workSheetsFromFile = xlsx.parse(this.filePath);

      const data = workSheetsFromFile[0]?.data;
      if (existsSync(this.filePath)) {
        this.fileStats = await stat(this.filePath);
        this.fileCreatedDate = this.fileStats.ctime;
        this.fileModifiedDate = this.fileStats.mtime;

        if (Array.isArray(data))
          data.forEach((row, index) => {
            if (Array.isArray(row)) {
              this.processLineArray(row, index);
            } else {
              //Alert that the core support file is not supported
              throw "Core support file is not supported, expecting Array";
            }
          });
      }
    } catch (Error) {
      //Alert that the core support file is not supported
      console.log(Error);
      this.entries.clear();
    }
    // console.log(this.entries);

    console.log(this.entries.size);
  }

  constructor(
    filePath = `./Data/Inputs/Core_Sets_Cost_Support_Price_List.xlsx`
  ) {
    super();
    this.filePath = filePath;
  }

  //Supplier Matches to filter out our items
  ourDistributors = [
    "Equal Exchange - Direct",
    "Tony's Fine Foods - Ridgefield, WA",
    "UNFI - Ridgefield, WA",
    "Ancient Nutrition - Direct",
  ];

  entryIsOurDistributor = (entry: CoreSupportEntry) => {
    if (this.ourDistributors.includes(entry.Distributor)) {
      return true;
    } else {
      return false;
    }
  };

  entryFromValueArray = function (
    valueArray: Array<string>
  ): CoreSupportEntry | null {
    if (Array.isArray(valueArray)) {
      const entry: CoreSupportEntry = {
        CoreSetsRound: parseInt(valueArray[0]),
        BuyInStart: valueArray[1],
        BuyInEnd: valueArray[2],
        Dept: valueArray[3],
        Category: valueArray[4],
        Distributor: valueArray[5],
        DistributorProductID: valueArray[6],
        UPCA: valueArray[7],
        FormattedUPC: valueArray[8],
        ReportingUPC: valueArray[9],
        Brand: valueArray[10],
        Description: valueArray[11],
        UnitCount: valueArray[12],
        PackSize: valueArray[13],
        PromoOI: valueArray[14],
        PromoMCB: valueArray[15],
        RebatePerUnit: valueArray[16],
        SaleCaseCost: valueArray[17],
        SaleUnitCost: valueArray[18],
        EDLPPrice: valueArray[19],
        Margin: valueArray[20],
        LineNotes: valueArray[21],
        Changes: valueArray[22],

        ID: valueArray[8],
      };
      return entry;
    }
    return null;
  };
  getEntryById(id: string): CoreSupportEntry | undefined {
    const entry = this.entries.get(id);

    return entry;
  }

  processLineArray(lineArray: string[], lineNumber: number) {
    switch (lineNumber) {
      case 0:
        //First line
        if (
          lineArray[0] !== "Core Sets Round" &&
          lineArray[18].trim() != "Sale Unit Cost"
        ) {
          throw `First line of worksheet not expected: ${lineArray.join("\t")}`;
        }
        break;
      default:
        {
          const entry = this.entryFromValueArray(lineArray);

          if (entry !== null) {
            if (this.entryIsOurDistributor(entry)) {
              if (this.entries.has(entry.ID)) {
                //TODO: change this to duplicate or otherWharehouse entries
                this.multipleAvailableDistributorItems.push(entry);
              } else {
                this.entries.set(entry.ID, entry);
                const ouritem = Inventory.getInstance().getEntryFromScanCode(
                  entry.ID
                );
                if (ouritem !== undefined) {
                  this.ourCoreItems.set(entry.ID, entry);
                }
              }
            } else {
              this.notOurWarehouse.push(entry);
            }
          } else {
            this.invalidLines.push(
              `Line ${lineNumber}:${lineArray.join(" | ")}`
            );
          }
        }

        break;
    }
  }

  getNumberOfEntries() {
    return this.entries.size;
  }
  getNumberOfMultipleAvailableDistributorItems() {
    return this.multipleAvailableDistributorItems.length;
  }
  getNumberOfInvalidLines() {
    return this.invalidLines.length;
  }

  getCreationDate(): Date | null {
    return this.fileCreatedDate;
  }
}
