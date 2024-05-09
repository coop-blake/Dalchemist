export enum CoreSetsStatus {
  NoFilePath = "No File Path",
  NoFileAtPath = "No File At Path",
  UnexpectedFile = "Core Sets File not as expected",
  Starting = "Starting",
  Loading = "Loading",
  Running = "Running",
  Error = "Error!",
}

export type CoreSetsAndBasicsPriceListEntry = {
  Program: string;
  CostVariation: string;
  StockingRequired: string;
  Start: string;
  End: string;
  Distributor: string;
  DistributorProductID: string;
  UPCA: string;
  CatapultUPC: string;
  SMSUPC: string;
  Brand: string;
  Description: string;
  Count: string;
  Size: string;
  UOM: string;
  OI: string;
  MCB: string;
  UnitRebate: string;
  CaseCost: string;
  UnitCost: string;
  PriceCeiling: string;
  Margin: string;
  LineNotes: string;
  Changes: string;
  Department: string;
  Subdepartment: string;
  Category: string;
  Subcategory: string;

  id: string;
};


export type CoreSupportReportEntry = {
  Program: string;
  UPC: string;
  Brand: string;
  Description: string;
  Subdepart: string;
  BasePrice: string;
  LowestPrice: string;
  PriceCeiling: string;
  DesiredRetail: string;
  NCGNotes: string;
  Notes: string;
  Dept: string;
  Difference: string;
};
