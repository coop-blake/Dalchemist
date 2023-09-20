
export enum InventoryStatus {
    Waiting = "Waiting for Cert",
    NoCertificate = "No Certificate",
    Starting = "Starting",
    Running = "Running",
    Error = "Error!",
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