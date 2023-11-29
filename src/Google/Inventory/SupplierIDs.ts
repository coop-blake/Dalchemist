import { SupplierIDEntry } from "./shared";
export class SupplierIDs {
  private static instance: SupplierIDs;

  private supplierIdsByScanCode = new Map<string, Array<SupplierIDEntry>>();

  private supplierIdsByVendor = new Map<string, Map<string, SupplierIDEntry>>();

  private vendors: Set<string> = new Set();

  private entries: Array<SupplierIDEntry> = new Array<SupplierIDEntry>();

  private constructor() {}

  public loadSupplierIDsFrom(supplierIDs: Array<SupplierIDEntry>) {
    supplierIDs.forEach((supplierIDEntry) => {
      this.consumeEntry(supplierIDEntry);

      //Add Vender to Set of vendors
      this.vendors.add(supplierIDEntry.Vendor);
    });
  }

  private consumeEntry(supplierIDEntry: SupplierIDEntry) {
    //Add SupplierIDEntry to Map of SupplierIDs by Vendor
    const supplierIdsByVendor = this.getSupplierIdsForVendor(
      supplierIDEntry.Vendor
    );
    supplierIdsByVendor.set(supplierIDEntry.SupplierItemID, supplierIDEntry);
    this.supplierIdsByVendor.set(supplierIDEntry.Vendor, supplierIdsByVendor);

    const supplierIdsByScanCode = this.getSupplierIDsForItemBy(
      supplierIDEntry.ScanCode
    );
    supplierIdsByScanCode.push(supplierIDEntry);
    this.supplierIdsByScanCode.set(
      supplierIDEntry.ScanCode,
      supplierIdsByScanCode
    );
  }

  public getVendors(): Set<string> {
    return this.vendors;
  }

  get supplierIDsByScanCode(): Map<string, Array<SupplierIDEntry>> {
    return this.supplierIdsByScanCode;
  }

  getSupplierIDsForItemBy(ScanCode: string) {
    let supplierIDEntries = this.supplierIdsByScanCode.get(ScanCode);
    if (supplierIDEntries === undefined) {
      supplierIDEntries = new Array<SupplierIDEntry>();
    }
    return supplierIDEntries;
  }
  getSupplierIdsForVendor(vendor: string): Map<string, SupplierIDEntry> {
    let supplierIdsByVendor = this.supplierIdsByVendor.get(vendor);
    if (supplierIdsByVendor === undefined) {
      supplierIdsByVendor = new Map<string, SupplierIDEntry>();
      this.supplierIdsByVendor.set(vendor, supplierIdsByVendor);
    }
    return supplierIdsByVendor;
  }

  static getInstance(): SupplierIDs {
    if (!SupplierIDs.instance) {
      SupplierIDs.instance = new SupplierIDs();
    }
    return SupplierIDs.instance;
  }
}
