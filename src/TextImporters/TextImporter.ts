/**
 * @module TextImporter
 * @category Utility
 * @category Importer
 * @internal
 */

//Base TextImporter Class
import { stat, open } from "fs/promises";
import { Stats, existsSync } from "fs";

/**
 * Base class for importing text data from a file
 *
 * Can be extended to provide custom file handling
 *
 * @example
 *
 */
export default class TextImporter<T> {
  //set this variable before starting import
  textFilePath = "";
  //set by class during import
  lineCount = 0;
  fileCreatedDate: Date | null = null;
  fileModifiedDate: Date | null = null;
  fileStats: Stats | null = null;
  fileName: string | null = null;

  entryFromValueArray: ((valueArray: Array<string>) => object | null) | null =
    null;

  //Entry Maps
  entries = new Map<string, T>();
  invalidLines = new Array<string>();

  multipleAvailableDistributorItems = new Array<T>();

  async start() {
    if (existsSync(this.textFilePath)) {
      this.fileStats = await stat(this.textFilePath);
      this.fileCreatedDate = this.fileStats.ctime;
      this.fileModifiedDate = this.fileStats.mtime;
      const File = await open(this.textFilePath);
      for await (const line of File.readLines({ encoding: `utf16le` })) {
        this.lineCount++;
        const lineString = line.toString();
        this.processLine(line);
      }
      await File.close();
    }
  }

  getEntryFromScanCode(scanCode: string) {
    return this.entries.get(scanCode);
  }
  processLine(line: string) {
    console.error("processLine should be provide by subclass", line);
  }

  hasInvalidLines() {
    return this.invalidLines.length > 0 ? true : false;
  }
  getCreationDate(): Date | null {
    return this.fileCreatedDate;
  }
  getNumberOfEntries() {
    return this.entries.size;
  }
  getNumberOfMultipleAvailableDistributorItems() {
    return this.multipleAvailableDistributorItems.length;
  }
  getNumberOfInvalidLines() {
    return this.invalidLines.length;
  }
  forEachEntry(functionToCall: (entry: T) => void) {
    this.entries.forEach((entry) => {
      functionToCall(entry);
    });
  }
  forEachInvalidEntry(functionToCall: (entry: T) => void) {
    this.multipleAvailableDistributorItems.forEach((entry) => {
      functionToCall(entry);
    });
  }

  forEachInvalidLine(functionToCall: (line: string) => void) {
    this.invalidLines.forEach((entry) => {
      functionToCall(entry);
    });
  }
}
