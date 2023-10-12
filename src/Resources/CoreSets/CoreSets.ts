import { CoreSupportEntry, coreSupportLineReader } from "./CoreSupport";
import { entryIsOurDistributor } from "./Distributors";
import { Importer } from "../../Importers/Base";
import { XlsxInput } from "../../Importers/Xlsx";

export class CoreSets {
  notOurCoreItems = new Map<string, Array<CoreSupportEntry>>();
  ourCoreItems = new Map<string, Array<CoreSupportEntry>>();

  async read(filePath: string): Promise<CoreSupportEntry[]> {
    const coreSupportInput = new XlsxInput(filePath);
    const importer = new Importer(coreSupportLineReader, coreSupportInput);
    return await importer.start();
  }

  async process(entries: CoreSupportEntry[]) {
    entries.forEach((entry) => {
      entryIsOurDistributor(entry)
        ? this.mapOurItem(entry)
        : this.mapNotOurItem(entry);
    });
  }

  mapOurItem(entry: CoreSupportEntry) {
    const distributorEntries = this.ourCoreItems.get(entry.id) ?? [];
    distributorEntries.push(entry);
    this.ourCoreItems.set(entry.id, distributorEntries);
  }

  mapNotOurItem(entry: CoreSupportEntry) {
    const distributorEntries = this.notOurCoreItems.get(entry.id) ?? [];
    distributorEntries.push(entry);
    this.notOurCoreItems.set(entry.id, distributorEntries);
  }
  getNumberOfOurItems(): number {
    return this.ourCoreItems.size;
  }
  getNumberOfNotOurItems(): number {
    return this.notOurCoreItems.size;
  }
}
