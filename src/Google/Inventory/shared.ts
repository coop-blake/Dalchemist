export enum InventoryStatus {
  Waiting = "Waiting for Cert",
  NoCertificate = "No Certificate",
  Starting = "Starting",
  Running = "Running",
  Error = "Error!"
}

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
  valuesArray: Array<string>;
};

export type AltIDEntry = {
  ScanCode: string;
  Quanity: string;
  ParentScanCode: string;
};

export type SupplierIDEntry = {
  ScanCode: string;
  Vendor: string;
  SupplierItemID: string;
  Unit: string;
  UnitQuantity: string;
  Quantity: string;
  PrimaryFlag: string;
  Default: string;
  Discontinued: string;
};
export const AltIDEntryFromValueArray = function (
  valueArray: Array<string>
): AltIDEntry {
  if (valueArray.length !== 3) {
    valueArray = fillArrayWithEmptyStrings(3, valueArray);
  }
  const entry: AltIDEntry = {
    ScanCode: valueArray[0].trim(),
    Quanity: valueArray[1].trim(),
    ParentScanCode: valueArray[2].trim()
  };
  return entry;
};
export type PromoEntry = {
  ScanCode: string;
  Price: string;
  Discount: string;
  Worksheet: string;
  Start: string;
  End: string;
};
export const PromoEntryFromValueArray = function (
  valueArray: Array<string>
): PromoEntry {
  if (valueArray.length !== 6) {
    valueArray = fillArrayWithEmptyStrings(6, valueArray);
  }
  const entry: PromoEntry = {
    ScanCode: valueArray[0].trim(),
    Price: valueArray[1].trim(),
    Discount: valueArray[2].trim(),
    Worksheet: valueArray[3].trim(),
    Start: valueArray[4].trim(),
    End: valueArray[5].trim()
  };
  return entry;
};

function fillArrayWithEmptyStrings(num: number, arr: string[]): string[] {
  if (arr.length >= num) {
    return arr;
  }

  const diff = num - arr.length;
  const emptyStrings = new Array(diff).fill("");

  return [...arr, ...emptyStrings];
}
