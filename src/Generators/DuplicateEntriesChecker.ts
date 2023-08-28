/**
 
 * When ran this file returns a list of lines with duplicate Values
 * in the first coloumn of a tab seperated file
 * 
 * Can be used to check Sale imports that are copied from NCG files
 * 
 * Todo: Add arguments to chose which column contains the unique id
 * and an argument for checking a file by path
 * 
 * Import the Inventory And PriceBook Importers
 * 
 * @module DuplicateCheck
 * @category Utility
 * @internal
 */

import DuplicateEntry from "../TextImporters/DuplicateEntry";

class DuplicateEntriesChecker {
  DupCheckImport = new DuplicateEntry();

  constructor() {
    //call TextImporter Parent Constructor
  }

  async start() {
    await this.DupCheckImport.start();
  }
  getNumberOfDuplicates() {
    return this.DupCheckImport.dupEntries.size;
  }
  getOutput() {
    const entries = this.DupCheckImport.entries;

    let output = "<pre>Duplicate Entries\n\n";
    this.DupCheckImport.dupEntries.forEach((entry) => {
      const originalEntry = entries.get(entry[0].scanCode);
      if (originalEntry != null) {
        output += `${entry[0].scanCode} was in document ${
          entry.length + 1
        } times: \n`;

        output += `           :${originalEntry.scanCode}:${originalEntry.price} \n`;

        entry.forEach(() => {
          output += `           :${originalEntry.scanCode}:${originalEntry.price}\n`;
        });
      }
    });

    output +=
      `\n\n${this.DupCheckImport.dupEntries.size} Duplicated Entries` +
      "</pre>";
    return output;
  }

  getTSVOutput() {
    const entries = this.DupCheckImport.entries;

    let output = "Scan Code: \tTimes Found: \r\n";
    this.DupCheckImport.dupEntries.forEach((entry) => {
      const originalEntry = entries.get(entry[0].scanCode);
      if (originalEntry != null) {
        output += `${entry[0].scanCode} \t ${entry.length + 1}`;

        output += `\t${originalEntry.price}`;

        entry.forEach(() => {
          output += `\t${originalEntry.price}`;
        });
        output += "\r\n";
      }
    });

    return output;
  }
}

export default new DuplicateEntriesChecker();
