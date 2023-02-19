import TextImporter from "../TextImporters/TextImporter";

import xlsx from "node-xlsx";
import { stat, open } from "fs/promises";
import { Stats, existsSync } from "fs";

type CoreSupportEntry = {
  LineNumber: number;
  Changes: string;
  CoreSetsRound: string;
  BuyinStart: string;
  BuyinEnd: string;
  Dept: string;
  Category: string;
  EastUPC: string;
  WestUPC: string;
  FormattedUPC: string;
  ReportingUPC: string;
  EastItem: string;
  WestItem: string;
  Vendor: string;
  UnitCount: string;
  PackSize: string;
  Description: string;
  LineNotes: string;
  EastPromoOI: string;
  EastPromoMCB: string;
  EastRebateperUnit: string;
  EastSaleCaseCost: string;
  EastSaleUnitCost: string;
  EastEDLPPrice: string;
  EastMargin: string;
  CentralPromoOI: string;
  CentralPromoMCB: string;
  CentralRebateperUnit: string;
  CentralSaleCaseCost: string;
  CentralSaleUnitCost: string;
  CentralEDLPPrice: string;
  CentralMargin: string;
  WestRocklinPromoOI: string;
  WestRocklinPromoMCB: string;
  WestRocklinRebateperUnit: string;
  WestRocklinSaleCaseCost: string;
  WestRocklinSaleUnitCost: string;
  WestRocklinEDLPPrice: string;
  WestRocklinMargin: string;
  WestRidgefieldPromoOI: string;
  WestRidgefieldPromoMCB: string;
  WestRidgefieldRebateperUnit: string;
  WestRidgefieldSaleCaseCost: string;
  WestRidgefieldSaleUnitCost: string;
  WestRidgefieldEDLPPrice: string;
  WestRidgefieldMargin: string;
  WestMorenoValleyPromoOI: string;
  WestMorenoValleyPromoMCB: string;
  WestMorenoValleyRebateperUnit: string;
  WestMorenoValleySaleCaseCost: string;
  WestMorenoValleySaleUnitCost: string;
  WestMorenoValleyEDLPPrice: string;
  WestMorenoValleyMargin: string;
  WestDenverPromoOI: string;
  WestDenverPromoMCB: string;
  WestDenverRebateperUnit: string;
  WestDenverSaleCaseCost: string;
  WestDenverSaleUnitCost: string;
  WestDenverEDLPPrice: string;
  WestDenverMargin: string;
  WestTexasPromoOI: string;
  WestTexasPromoMCB: string;
  WestTexasRebateperUnit: string;
  WestTexasSaleCaseCost: string;
  WestTexasSaleUnitCost: string;
  WestTexasEDLPPrice: string;
  WestTexasMargin: string;

  ID: string;
};
export class CoreSupport extends TextImporter<CoreSupportEntry> {
  lineCount = 0;
  filePath = "";

  notOurWarehouse = new Array<CoreSupportEntry>();

  ourCoreItems = new Map<string, CoreSupportEntry>();

  async start() {
    try {
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
    filePath = `./Data/Inputs/Core_Sets_Cost_Support_Price_List_2023_Feb.xlsx`
  ) {
    super();
    this.filePath = filePath;
  }

  entryFromValueArray = function (
    valueArray: Array<string>
  ): CoreSupportEntry | null {
    if (Array.isArray(valueArray)) {
      const entry: CoreSupportEntry = {
        LineNumber: parseInt(valueArray[0]),
        Changes: valueArray[1],
        CoreSetsRound: valueArray[2],
        BuyinStart: valueArray[3],
        BuyinEnd: valueArray[4],
        Dept: valueArray[5],
        Category: valueArray[6],
        EastUPC: valueArray[7],
        WestUPC: valueArray[8],
        FormattedUPC: valueArray[9],
        ReportingUPC: valueArray[10],
        EastItem: valueArray[11],
        WestItem: valueArray[12],
        Vendor: valueArray[13],
        UnitCount: valueArray[14],
        PackSize: valueArray[15],
        Description: valueArray[16],
        LineNotes: valueArray[17],
        EastPromoOI: valueArray[18],
        EastPromoMCB: valueArray[19],
        EastRebateperUnit: valueArray[20],
        EastSaleCaseCost: valueArray[21],
        EastSaleUnitCost: valueArray[22],
        EastEDLPPrice: valueArray[23],
        EastMargin: valueArray[24],
        CentralPromoOI: valueArray[25],
        CentralPromoMCB: valueArray[26],
        CentralRebateperUnit: valueArray[27],
        CentralSaleCaseCost: valueArray[28],
        CentralSaleUnitCost: valueArray[29],
        CentralEDLPPrice: valueArray[30],
        CentralMargin: valueArray[31],
        WestRocklinPromoOI: valueArray[32],
        WestRocklinPromoMCB: valueArray[33],
        WestRocklinRebateperUnit: valueArray[34],
        WestRocklinSaleCaseCost: valueArray[35],
        WestRocklinSaleUnitCost: valueArray[36],
        WestRocklinEDLPPrice: valueArray[37],
        WestRocklinMargin: valueArray[38],
        WestRidgefieldPromoOI: valueArray[39],
        WestRidgefieldPromoMCB: valueArray[40],
        WestRidgefieldRebateperUnit: valueArray[41],
        WestRidgefieldSaleCaseCost: valueArray[42],
        WestRidgefieldSaleUnitCost: valueArray[43],
        WestRidgefieldEDLPPrice: valueArray[44],
        WestRidgefieldMargin: valueArray[45],
        WestMorenoValleyPromoOI: valueArray[46],
        WestMorenoValleyPromoMCB: valueArray[47],
        WestMorenoValleyRebateperUnit: valueArray[48],
        WestMorenoValleySaleCaseCost: valueArray[49],
        WestMorenoValleySaleUnitCost: valueArray[50],
        WestMorenoValleyEDLPPrice: valueArray[51],
        WestMorenoValleyMargin: valueArray[52],
        WestDenverPromoOI: valueArray[53],
        WestDenverPromoMCB: valueArray[54],
        WestDenverRebateperUnit: valueArray[55],
        WestDenverSaleCaseCost: valueArray[56],
        WestDenverSaleUnitCost: valueArray[57],
        WestDenverEDLPPrice: valueArray[58],
        WestDenverMargin: valueArray[59],
        WestTexasPromoOI: valueArray[60],
        WestTexasPromoMCB: valueArray[61],
        WestTexasRebateperUnit: valueArray[62],
        WestTexasSaleCaseCost: valueArray[63],
        WestTexasSaleUnitCost: valueArray[64],
        WestTexasEDLPPrice: valueArray[65],
        WestTexasMargin: valueArray[67],

        ID: valueArray[9],
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
        if (lineArray[0] !== "undefined" && lineArray[18].trim() != "East") {
          throw `First line of worksheet not expected: ${lineArray.join("\t")}`;
        }
        break;
      case 1:
        //second line
        if (
          lineArray[0] === undefined ||
          lineArray[0].trim() !== "Line Number"
        ) {
          throw `Second line of worksheet not expected: ${lineArray.join(
            "\t"
          )}`;
        }
        break;
      default:
        {
          const lineNumberFromData = lineArray[0];
          if (
            lineNumberFromData === undefined ||
            typeof lineNumberFromData !== "number"
          ) {
            throw `Second line of worksheet not expected: ${lineArray.join(
              "\t"
            )}`;
          } else {
            const entry = this.entryFromValueArray(lineArray);
            if (entry !== null) {
              if (this.entries.has(entry.ID)) {
                this.invalidEntries.push(entry);
              } else {
                this.entries.set(entry.ID, entry);
                if (entry.WestRidgefieldEDLPPrice !== undefined) {
                  this.ourCoreItems.set(entry.ID, entry);
                } else {
                  this.notOurWarehouse.push(entry);
                }
              }
            } else {
              this.invalidLines.push(
                `Line ${lineNumber}:${lineArray.join(" | ")}`
              );
            }
          }
        }
        break;
    }
  }

  getNumberOfEntries() {
    return this.entries.size;
  }
  getNumberOfInvalidEntries() {
    return this.invalidEntries.length;
  }
  getNumberOfInvalidLines() {
    return this.invalidLines.length;
  }

  getCreationDate(): Date | null {
    return this.fileCreatedDate;
  }
}
