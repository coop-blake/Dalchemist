//Base TextImporter Class
import { stat, open } from "fs/promises";
import { Stats } from "fs";

export default class TextImporter {
  //set this variable before starting import
  textFilePath = "";
  //set by class durring import
  lineCount = 0;
  fileCreatedDate: Date | null = null;
  fileModifiedDate: Date | null = null;
  fileStats: Stats | null = null;
  fileName: string | null = null;

  entryFromValueArray: ((valueArray: Array<string>) => object | null) | null =
    null;

  //Entry Maps
  entries = new Map<string, object>();
  invalidLines = new Array<string>();

  invalidEntries = new Array<object>();

  async start() {
    this.fileStats = await stat(this.textFilePath);
    const File = await open(this.textFilePath);
    for await (const line of File.readLines()) {
      this.lineCount++;
      this.processLine(line);
    }
    await File.close();
  }

  getEntryFromScanCode(scanCode: string) {
    return this.entries.get(scanCode);
  }
  processLine(line: string) {
    console.log("processLine should be provide by subclass", line);
  }

  hasInvalidLines() {
    return this.invalidLines.length > 0 ? true : false;
  }
  printInvalidEntries() {
    console.log(JSON.stringify(this.invalidEntries, null, 4));
  }

  printInvalidLines() {
    console.log(JSON.stringify(this.invalidLines, null, 4));
  }

  getTotalEntries() {
    return Object.keys(this.entries).length;
  }

  forEachEntry(functionToCall: (entry: object) => void) {
    this.entries.forEach((entry) => {
      functionToCall(entry);
    });
  }
}
