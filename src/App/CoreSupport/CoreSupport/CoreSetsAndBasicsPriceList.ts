import {
  Importer,
  StringsAssimilator,
  LineReader,
} from "../../../Importer/Base";
import { XlsxInput } from "../../../Importer/InputLines/Xlsx";
import { CoreSetsAndBasicsPriceListEntry } from "../shared";
import { statSync, existsSync, Stats } from "fs";

export class CoreSetsAndBasicsPriceList {
  private lastLoadedFilePath = "";
  private lastLoadedFileStat: Stats | undefined = undefined;
  private lastExtraction: CoreSetsAndBasicsPriceListEntry[] = [];

  public async read(
    filePath: string
  ): Promise<CoreSetsAndBasicsPriceListEntry[]> {
    const coreSupportInput = new XlsxInput(filePath);
    const importer = new Importer(
      coreSupportPriceListLineReader,
      coreSupportInput
    );
    this.lastExtraction = await importer.start();
    return this.lastExtraction;
  }

  public async getEntriesFor(
    filePath: string
  ): Promise<CoreSetsAndBasicsPriceListEntry[]> {
    try {
      if (existsSync(filePath)) {
        const fileStat = statSync(filePath);
        if (
          this.lastLoadedFilePath !== filePath ||
          this.lastLoadedFileStat?.mtimeMs !== fileStat.mtimeMs
        ) {
          this.lastExtraction = await this.read(filePath);
          this.lastLoadedFilePath = filePath;
          this.lastLoadedFileStat = fileStat;
        }
        return this.lastExtraction;
      }
    } catch {
      return [];
    }

    return [];
  }
}

class CoreSetsAndBasicsPriceListAssimilator extends StringsAssimilator<CoreSetsAndBasicsPriceListEntry> {
  digest() {
    return entryFromValueArray(this.raw);
  }
}
class CoreSetsAndBasicsPriceListLineReader extends LineReader<CoreSetsAndBasicsPriceListEntry> {}
const coreSupportPriceListLineReader = new CoreSetsAndBasicsPriceListLineReader(
  CoreSetsAndBasicsPriceListAssimilator
);

function convertExcelDate(excelDateNumber: number) {
  const baseDate = new Date(Date.UTC(1899, 11, 30)); // Excel's base date

  // Calculate the milliseconds for the given Excel date number
  const dateMilliseconds =
    baseDate.getTime() + (excelDateNumber - 1) * 24 * 60 * 60 * 1000;

  // Create a new Date object for the calculated date
  return new Date(dateMilliseconds);
}

const entryFromValueArray = function (
  valueArray: Array<string>
): CoreSetsAndBasicsPriceListEntry | null {
  if (Array.isArray(valueArray)) {
    const entry: CoreSetsAndBasicsPriceListEntry = {
      Program: valueArray[0],
      CostVariation: valueArray[1],
      StockingRequired: valueArray[2],
      Start: valueArray[3]
        ? convertExcelDate(parseFloat(valueArray[3])).toLocaleDateString(
            "en-us",
            {
              year: "numeric",
              month: "numeric",
              day: "numeric",
            }
          )
        : "",
      End: valueArray[4]
        ? convertExcelDate(parseFloat(valueArray[4])).toLocaleDateString(
            "en-us",
            {
              year: "numeric",
              month: "numeric",
              day: "numeric",
            }
          )
        : "",
      Distributor: valueArray[5],
      DistributorProductID: valueArray[6],
      UPCA: valueArray[7],
      CatapultUPC: valueArray[8],
      SMSUPC: valueArray[9],
      Brand: valueArray[10],
      Description: valueArray[11],
      Count: valueArray[12],
      Size: valueArray[13],
      UOM: valueArray[14],
      OI: valueArray[15],
      MCB: valueArray[16],
      UnitRebate: valueArray[17],
      CaseCost: valueArray[18],
      UnitCost: valueArray[19],
      PriceCeiling: valueArray[20],
      Margin: valueArray[21],
      LineNotes: valueArray[22],
      Changes: valueArray[23],
      Department: valueArray[24],
      Subdepartment: valueArray[25],
      Category: valueArray[26],
      Subcategory: valueArray[27],

      id: valueArray[8] + valueArray[5] + valueArray[6],
    };
    //if it is the first line, return null
    if (
      entry.Brand === "Brand" &&
      entry.Description === "Description" &&
      entry.Count === "Count"
    ) {
      return null;
    }
    return entry;
  }
  return null;
};
