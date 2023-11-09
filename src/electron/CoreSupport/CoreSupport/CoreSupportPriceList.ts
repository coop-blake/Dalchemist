import {
  Importer,
  StringsAssimilator,
  LineReader,
} from "../../../Importer/Base";
import { XlsxInput } from "../../../Importer/InputLines/Xlsx";
import { CoreSupportPriceListEntry } from "../shared";
import { statSync, existsSync, Stats } from "fs";

export class CoreSupportPriceList {
  private lastLoadedFilePath = "";
  private lastLoadedFileStat: Stats | undefined = undefined;
  private lastExtraction: CoreSupportPriceListEntry[] = [];

  public async read(filePath: string): Promise<CoreSupportPriceListEntry[]> {
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
  ): Promise<CoreSupportPriceListEntry[]> {
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
    const fileStat = statSync(filePath);

    return [];
  }
}

class CoreSupportPriceListAssimilator extends StringsAssimilator<CoreSupportPriceListEntry> {
  digest() {
    return entryFromValueArray(this.raw);
  }
}
class CoreSupportPriceListLineReader extends LineReader<CoreSupportPriceListEntry> {}
const coreSupportPriceListLineReader = new CoreSupportPriceListLineReader(
  CoreSupportPriceListAssimilator
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
): CoreSupportPriceListEntry | null {
  if (Array.isArray(valueArray)) {
    const entry: CoreSupportPriceListEntry = {
      CoreSetsRound: valueArray[0],
      BuyInStart: valueArray[1]
        ? convertExcelDate(parseFloat(valueArray[1])).toLocaleDateString(
            "en-us",
            {
              year: "numeric",
              month: "numeric",
              day: "numeric",
            }
          )
        : "",
      BuyInEnd: valueArray[2]
        ? convertExcelDate(parseFloat(valueArray[2])).toLocaleDateString(
            "en-us",
            {
              year: "numeric",
              month: "numeric",
              day: "numeric",
            }
          )
        : "",
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

      id: valueArray[8] + valueArray[5] + valueArray[6],
    };
    //if it is the first line, return null
    if (
      entry.Brand === "Brand" &&
      entry.Description === "Description" &&
      entry.EDLPPrice === "EDLP Price"
    ) {
      return null;
    }
    return entry;
  }
  return null;
};
