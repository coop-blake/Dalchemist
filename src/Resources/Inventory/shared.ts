import { fillArrayWithEmptyStrings } from "../../Utility";

export type InventoryEntry = {
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

export enum Status {
  Initializing = "Initializing",
  Loading = "Loading",
  Available = "Available",
  Unavailable = "Unavailable",
  Error = "Unexpected Error",
}

export const inventoryEntryFromSheetValueArray = function (
  valueArray: Array<string>
): InventoryEntry {
  if (valueArray.length !== 19) {
    valueArray = fillArrayWithEmptyStrings(19, valueArray);
  }
  const entry: InventoryEntry = {
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
    SouthLSD: valueArray[18].trim(),
  };
  return entry;
};
