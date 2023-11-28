import { SupplierIDEntry } from "./shared";
export class SupplierIDs {
  private static instance: SupplierIDs;

  private supplierIdsByScanCode = new Map<string, Array<SupplierIDEntry>>();

  private vendors: Array<string> = [];
  private constructor() {}
  public loadSuplierIDsFrom(supplierIDs: Array<SupplierIDEntry>) {
    supplierIDs.forEach((supplierIDEntry) => {
      this.setVendorForItem(supplierIDEntry);
      if (!this.vendors.includes(supplierIDEntry.Vendor)) {
        this.vendors.push(supplierIDEntry.Vendor);
      }
    });
  }

  public getVendors(): Array<string> {
    return this.vendors;
  }

  get supplierIDsByScancode(): Map<string, Array<SupplierIDEntry>> {
    return this.supplierIdsByScanCode;
  }

  getSupplierIDsForItemBy(ScanCode: string) {
    let supplierIDEntries = this.supplierIdsByScanCode.get(ScanCode);
    if (supplierIDEntries === undefined) {
      supplierIDEntries = new Array<SupplierIDEntry>();
    }
    return supplierIDEntries;
  }

  setVendorForItem(supplierIDEntry: SupplierIDEntry) {
    const promos = this.getSupplierIDsForItemBy(supplierIDEntry.ScanCode);
    promos.push(supplierIDEntry);
    this.supplierIdsByScanCode.set(supplierIDEntry.ScanCode, promos);
  }

  static getInstance(): SupplierIDs {
    if (!SupplierIDs.instance) {
      SupplierIDs.instance = new SupplierIDs();
    }
    return SupplierIDs.instance;
  }
}
