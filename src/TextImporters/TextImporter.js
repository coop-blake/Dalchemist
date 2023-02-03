//Base TextImporter Class
import { truncate } from "node:fs";
import * as fs from "node:fs/promises";

class TextImporter {
  //set this variable before starting import
  textFilePath = "";
  //set by class durring import
  lineCount = 0;
  fileCreatedDate = null;
  fileModifiedDate = null;
  fileStats = null;
  processedValues = null;
  invalidLines = [];
  invalidEntries = [];

  async start() {
    try {
      this.fileStats = await fs.stat(this.textFilePath);
      const File = await fs.open(this.textFilePath);
      for await (const line of File.readLines()) {
        this.lineCount++;
        this.processLine(line);
      }
      await File.close();
      this.onFinished();
    } catch (Error) {
      this.onError(Error);
    }
  }

  getEntryFromScanCode(scanCode) {
    return this.processedValues[scanCode];
  }
  processLine(line) {
    console.log("processLine should be provide by subclass");
  }
  onFinished() {
    //this function can be overwritten in subclass
    //Called after file is imported
  }

  onError(Error) {
    console.log(Error);
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
    return Object.keys(this.processedValues).length;
  }

  forEachEntry(functionToCall) {
    if (Array.isArray(this.processedValues)) {
      for (const entry of this.processedValues) {
        functionToCall(entry);
      }
    } else {
      for (const entry of Object.entries(this.processedValues)) {
        functionToCall(entry[1]);
      }
    }
  }
}

export default TextImporter;
