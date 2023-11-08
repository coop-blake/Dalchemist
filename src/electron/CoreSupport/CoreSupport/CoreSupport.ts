/**
 * @module CoreSupport
 * @category Core Support
 * @category Processor
 * @internal
 * Core Support Excel File Processor
 * For reading in the Core Support Excel File as CoreSupportEntry objects
 */

//toDO this file needs to be converted to use Importer after updating importer XLSX inputlines
import { CoreSupportPriceListEntry } from "./shared";
import { Inventory } from "../../../Google/Inventory/Inventory";
import * as fs from "fs";
import Settings from "../../Settings";
import { CoreSets } from "../CoreSets";
import { CoreSupportState } from "./State";
import { CoreSupportPriceList } from "./CoreSupportPriceList";

function convertExcelDate(excelDateNumber: number) {
  const baseDate = new Date(Date.UTC(1899, 11, 30)); // Excel's base date

  // Calculate the milliseconds for the given Excel date number
  const dateMilliseconds =
    baseDate.getTime() + (excelDateNumber - 1) * 24 * 60 * 60 * 1000;

  // Create a new Date object for the calculated date
  return new Date(dateMilliseconds);
}

export class CoreSupport {
  notOurWarehouse = new Array<CoreSupportPriceListEntry>();

  ourCoreItems = new Map<string, CoreSupportPriceListEntry>();
  private entries = new Array<CoreSupportPriceListEntry>();

  private state = new CoreSupportState();

  private CoreSupportPriceList = new CoreSupportPriceList();
  private filePath = "";
  getState(): CoreSupportState {
    return this.state;
  }
  getEntries() {
    return this.entries;
  }

  async loadCoreSetsExcelFile() {
    const filePath = await Settings.getCoreSetsExcelFilePath();
    console.log(filePath);
    if (filePath && filePath.length > 0) {
      this.filePath = filePath;
      await this.start();
      return Date.now();
    } else {
      console.log("Failed to select file", filePath);
      return 0;
    }
  }

  public async selectFilePath() {
    const filePath = await Settings.selectCoreSetsLocation();
    console.log(filePath);
    if (filePath && filePath.length > 0) {
      this.filePath = filePath;
      return filePath;
    } else {
      console.log("Failed to select file", filePath);
      return "";
    }
  }

  public doesKnownFileExist(): boolean {
    return Settings.doesCoreSetsExcelFileLocationExist();
  }

  clearData() {
    this.state.setSelectedDistributorEntries([]);
    this.state.setAllEntries([]);
    this.state.setAllDistributors(new Set<string>());
  }

  async start() {
    const distributors: Set<string> = new Set<string>();
    const selectedDistributors = Settings.getCoreSetDistributors();
    const ourDistributorsEntries = Array<CoreSupportPriceListEntry>();
    const notOurItems = Array<CoreSupportPriceListEntry>();
    try {
      const entries = await this.CoreSupportPriceList.getEntriesFor(
        await Settings.getCoreSetsExcelFilePath()
      );
      entries.forEach((entry: CoreSupportPriceListEntry) => {
        if (selectedDistributors.includes(entry.Distributor)) {
          ourDistributorsEntries.push(entry);
        } else {
          notOurItems.push(entry);
        }
        distributors.add(entry.Distributor);
      });
      this.state.setSelectedDistributorEntries(ourDistributorsEntries);
      this.state.setAllEntries(entries);
      this.state.setAllDistributors(distributors);
    } catch (Error) {
      //Alert that the core support file is not supported
      console.log(Error);
    }
  }

  constructor() {
    this.state.setSelectedDistributors(
      new Set(Settings.getCoreSetDistributors())
    );
  }

  //Supplier Matches to filter out our items
  entryIsOurDistributor = (entry: CoreSupportPriceListEntry) => {
    const ourDistributors = Array.from(this.state.selectedDistributors);
    if (ourDistributors.includes(entry.Distributor)) {
      return true;
    } else {
      return false;
    }
  };
}
