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


export type CoreSupportPriceListEntry = {
  CoreSetsRound: string;
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

export type CoreSupportReportEntry = {
  UPC: string;
  Brand: string;
  Description: string;
  Subdepart: string;
  CurrentBasePrice: string;
  LowestPrice: string;
  CoreSetRetail: string;
  DesiredRetail: string;
  NCGNotes: string;
  Notes: string;
  Dept: string;
  Difference: string;
};
