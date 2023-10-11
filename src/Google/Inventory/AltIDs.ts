import { AltIDEntry } from "./shared";
export default class AltIDs {
  private static instance: AltIDs;

  private altIDsByScanCode = new Map<string, Array<AltIDEntry>>();

  private worksheets: Array<string> = [];
  private constructor() {}
  public loadAltIDsFrom(altIDs: Array<AltIDEntry>) {
    altIDs.forEach((altID) => {
      this.setAltIDForItem(altID);
    });
  }

  public getWorksheets(): Array<string> {
    return this.worksheets;
  }

  getAltIDsForItemBy(ScanCode: string) {
    let altIDs = this.altIDsByScanCode.get(ScanCode);
    if (altIDs === undefined) {
      altIDs = new Array<AltIDEntry>();
    }
    return altIDs;
  }

  setAltIDForItem(altID: AltIDEntry) {
    const altIDs = this.getAltIDsForItemBy(altID.ScanCode);
    altIDs.push(altID);
    this.altIDsByScanCode.set(altID.ScanCode, altIDs);
  }

  static getInstance(): AltIDs {
    if (!AltIDs.instance) {
      AltIDs.instance = new AltIDs();
    }
    return AltIDs.instance;
  }
}
