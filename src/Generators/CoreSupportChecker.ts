/**
 * Checks the Core Supports vs Inventory
 * @module Core Support
 * @category Utility
 *
 * @internal
 */

import { CoreSupport } from "../Processors/CoreSupport";

class CoreSupportChecker {
  coreSupport = new CoreSupport();

  constructor() {
    //call TextImporter Parent Constructor
  }

  async start() {
    await this.coreSupport.start();
  }

  getOurDistributors() {
    return this.coreSupport.ourDistributors;
  }
  getNumberOfEntries() {
    return this.coreSupport.getNumberOfEntries();
  }
  getNumberOfOurItems() {
    return this.coreSupport.ourCoreItems.size;
  }
  getNumberOfMultipleAvailableDistributorItems() {
    return this.coreSupport.getNumberOfMultipleAvailableDistributorItems();
  }
  getNumberOfInvalidLines() {
    return this.coreSupport.getNumberOfInvalidLines();
  }
  getFileCreationDate() {
    return this.coreSupport.getCreationDate()?.toDateString();
  }
  getCoreDistributorEntriesOutput() {
    let output = "";
    this.coreSupport.forEachEntry((entry) => {
      output += Object.values(entry).join("\t") + "\n";
    });

    return output;
  }

  getTSVOutput() {
    const output = "Scan Code: \tTimes Found: \r\n";

    return output;
  }
}

export default new CoreSupportChecker();
