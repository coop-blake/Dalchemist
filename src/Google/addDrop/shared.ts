

  
  export type AttributeChangeEntry = {
    Date: string;
    Client: string;
    ScanCode: string;
    Supplier: string;
    SupplierItemID: string;
    Brand: string;
    Name: string;
    Unit: string;
    SubDepartment: string;
    Quantity: string;
    CaseCost: string;
    UnitCost: string;
    MARGIN: string;
    ShippingPercent: string;
    ProposedPrice: string;
    BasePrice: string;
    Department: string;
    BottleDepositFlag: string;
    LocalDirectFlag: string;
    LocalSixFlag: string;
    LocalORFlag: string;
    OGFlag: string;
    ChangeOne: string;
    ChangeTwo: string;
    ChangeThree: string;
    ChangeFour: string;
    Comments: string;
    BestDateForPriceChange: string;
    BestTimeForPriceChange: string;
    valuesArray: Array<string>;
  };
  
  export type NewItemEntry = {
    Date: string;
    Client: string;
    ScanCode: string;
    Supplier: string;
    SupplierItemID: string;
    Brand: string;
    Name: string;
    Unit: string;
    SubDepartment: string;
    Quantity: string;
    CaseCost: string;
    UnitCost: string;
    MARGIN: string;
    ShippingPercent: string;
    ProposedPrice: string;
    BasePrice: string;
    Department: string;
    BottleDepositFlag: string;
    LocalDirectFlag: string;
    LocalSixFlag: string;
    LocalORFlag: string;
    OGFlag: string;
    FlipChartAddFlag: string;
    Comments: string;
    valuesArray: Array<string>;
  };

  export enum AddDropStatus {
    NoCertificate = "No Certificate",
    Starting = "Starting",
    Running = "Running",
    Error = "Error!",
  }