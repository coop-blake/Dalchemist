import { PromoEntry } from "./shared";
export class Promos {
  private static instance: Promos;

  private promosByScanCode = new Map<string, Array<PromoEntry>>();

  private promos: Array<PromoEntry> = [];

  private worksheets: Array<string> = [];
  private constructor() {}
  public loadPromosFrom(promos: Array<PromoEntry>) {
    this.promos = promos;
    promos.forEach((promo) => {
      this.setPromoForItem(promo);
      if (!this.worksheets.includes(promo.Worksheet)) {
        this.worksheets.push(promo.Worksheet);
      }
    });
  }

  public getWorksheets(): Array<string> {
    return this.worksheets;
  }

  get promosByScancode(): Map<string, Array<PromoEntry>> {
    return this.promosByScanCode;
  }

  getPromosArray() {
    return this.promos;
  }

  getPromosForItemBy(ScanCode: string) {
    let promos = this.promosByScanCode.get(ScanCode);
    if (promos === undefined) {
      promos = new Array<PromoEntry>();
    }
    return promos;
  }

  setPromoForItem(promo: PromoEntry) {
    const promos = this.getPromosForItemBy(promo.ScanCode);
    promos.push(promo);
    this.promosByScanCode.set(promo.ScanCode, promos);
  }

  static getInstance(): Promos {
    if (!Promos.instance) {
      Promos.instance = new Promos();
    }
    return Promos.instance;
  }
}
