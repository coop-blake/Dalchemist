import { SheetInput } from "../../Importer/InputLines/Sheet";
import { LineImporter } from "../../Importer/Base";
import { fillArrayWithEmptyStrings } from "../../Utility";

export class InventorySheetReader extends LineImporter<InventorySheetEntry> {
  input: SheetInput;
  lineReader = inventorySheetLineReader;
  private spreadsheetId = "1HdBg3Ht1ALFTBkCXK1YA1cx0vZ9hPx8Ji9m0qy3YMnA";
  private range = `Inventory!A3:S50000`;
  constructor() {
    super();
    this.input = new SheetInput(this.spreadsheetId, this.range);
  }
}

import { StringsAssimilator, LineReader } from "../../Importer/Base";
//#########################################################################################################
// Line Reader for Importer
//========================================================/////////////////////////////////////////////////
class InventorySheetAssimilator extends StringsAssimilator<InventorySheetEntry> {
  digest() {
    return entryFromValueArray(this.raw);
  }
}
export class InventorySheetLineReader extends LineReader<InventorySheetEntry> {}
export const inventorySheetLineReader = new InventorySheetLineReader(
  InventorySheetAssimilator
);

//#########################################################################################################
// Type and array targets
//========================================================/////////////////////////////////////////////////
export type InventorySheetEntry = {
  ScanCode: string;
  DefaultSupplier: string;
  Department: string;
  Brand: string;
  Name: string;
  Size: string;
  ReceiptAlias: string;
  BasePrice: string;
  LastCost: string;
  AverageCost: string;
  SubDepartment: string;
  IdealMargin: string;
  Quantity: string;
  Unit: string;
  SupplierUnitID: string;
  N: string;
  S: string;
  NorthLSD: string;
  SouthLSD: string;
};

//#########################################################################################################
// Assign Array Values
//========================================================/////////////////////////////////////////////////
export const entryFromValueArray = function (
  valueArray: Array<string>
): InventorySheetEntry {
  if (valueArray.length !== 19) {
    valueArray = fillArrayWithEmptyStrings(19, valueArray);
  }
  const entry: InventorySheetEntry = {
    ScanCode: valueArray[0].trim(),
    DefaultSupplier: valueArray[1].trim(),
    Department: valueArray[2].trim(),
    Brand: valueArray[3].trim(),
    Name: valueArray[4].trim(),
    Size: valueArray[5].trim(),
    ReceiptAlias: valueArray[6].trim(),
    BasePrice: valueArray[7].trim(),
    LastCost: valueArray[8].trim(),
    AverageCost: valueArray[9].trim(),
    SubDepartment: valueArray[10].trim(),
    IdealMargin: valueArray[11].trim(),
    Quantity: valueArray[12].trim(),
    Unit: valueArray[13].trim(),
    SupplierUnitID: valueArray[14].trim(),
    N: valueArray[15].trim(),
    S: valueArray[16].trim(),
    NorthLSD: valueArray[17].trim(),
    SouthLSD: valueArray[18].trim()
  };
  return entry;
};
