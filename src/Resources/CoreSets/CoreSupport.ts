import { StringsAssimilator, LineReader } from "../../Importer/Base";
//#########################################################################################################
// Line Reader for Importer
//========================================================/////////////////////////////////////////////////
class CoreSupportAssimilator extends StringsAssimilator<CoreSupportEntry> {
  digest() {
    return entryFromValueArray(this.raw);
  }
}
export class CoreSupportLineReader extends LineReader<CoreSupportEntry> {}
export const coreSupportLineReader = new CoreSupportLineReader(
  CoreSupportAssimilator
);

//#########################################################################################################
// Type and array targets
//========================================================/////////////////////////////////////////////////
export type CoreSupportEntry = {
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

  id: string;
};

//#########################################################################################################
// Assign Array Values
//========================================================/////////////////////////////////////////////////
export const entryFromValueArray = function (
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
      //Choose identifier - FormattedUPC
      id: valueArray[8]
    };
    return entry;
  }
  return null;
};
