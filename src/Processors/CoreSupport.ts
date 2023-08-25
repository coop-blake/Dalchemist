/**
 * @module CoreSupport
 * @category Core Support
 * @category Processor
 * @internal
 */

import InventoryImporter from "../TextImporters/Inventory";

//Create new Import objects
const inventoryImport = new InventoryImporter();

import TextImporter from "../TextImporters/TextImporter";

import xlsx from "node-xlsx";
import { stat, open } from "fs/promises";
import { Stats, existsSync } from "fs";

type CoreSupportEntry = {
  CoreSetsRound: number;
  BuyInStart: string;
  BuyInEnd: string;
  Dept: string;
  Category: string;
  Distributor: string;
  DistributorProductID: string;
  UPCA: string;
  FormattedUPC: string;
  ReportingUPC: string;
  Brand: string;
  Description: string;
  UnitCount: string;
  PackSize: string;
  PromoOI: string;
  PromoMCB: string;
  RebatePerUnit: string;
  SaleCaseCost: string;
  SaleUnitCost: string;
  EDLPPrice: string;
  Margin: string;
  LineNotes: string;
  Changes: string;

  ID: string;
};
export class CoreSupport extends TextImporter<CoreSupportEntry> {
  lineCount = 0;
  filePath = "";

  notOurWarehouse = new Array<CoreSupportEntry>();

  ourCoreItems = new Map<string, CoreSupportEntry>();

  async start() {
    try {
      await inventoryImport.start();

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
    }
    console.log(this.entries);

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
          const lineNumberFromData = lineArray[0];
          // if (
          //   lineNumberFromData === undefined ||
          //   typeof lineNumberFromData !== "number"
          // ) {
          //   throw `Second line of worksheet not expected: ${lineArray.join(
          //     "\t"
          //   )}`;
          // } else {
          const entry = this.entryFromValueArray(lineArray);

          if (entry !== null) {
            if (this.entryIsOurDistributor(entry)) {
              if (this.entries.has(entry.ID)) {
                //TODO: change this to duplicate or otherWharehouse entries
                this.multipleAvailableDistributorItems.push(entry);
              } else {
                this.entries.set(entry.ID, entry);
                const ouritem = inventoryImport.getEntryFromScanCode(entry.ID);
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

          // if (entry !== null) {
          //   if (this.entries.has(entry.ID)) {
          //     this.invalidEntries.push(entry);
          //   } else {
          //     this.entries.set(entry.ID, entry);
          //     if (this.entryIsOurDistributor(entry)) {
          //       this.ourCoreItems.set(entry.ID, entry);
          //     } else {
          //       this.notOurWarehouse.push(entry);
          //     }
          //   }
          // } else {
          //   this.invalidLines.push(
          //     `Line ${lineNumber}:${lineArray.join(" | ")}`
          //   );
          // }
        }
        // }
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
