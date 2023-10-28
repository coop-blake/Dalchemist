import { InputLines } from "../Base";

import { stat, open } from "fs/promises";
import { Stats, existsSync } from "fs";

import * as path from "path";

export class SeperatedTextInput implements InputLines {
  filePath: string;
  fileCreatedDate: Date | null = null;
  fileModifiedDate: Date | null = null;
  fileStats: Stats | null = null;
  fileName: string | null = null;

  encoding: BufferEncoding;
  seperator: string;

  constructor(
    filePath: string,
    encoding: BufferEncoding = "utf8",
    seperator = "\t"
  ) {
    this.filePath = path.resolve(filePath);
    this.encoding = encoding;
    this.seperator = seperator;
  }

  async getLines() {
    const returnLines = Array<Array<string>>();
    if (existsSync(this.filePath)) {
      this.fileStats = await stat(this.filePath);
      this.fileCreatedDate = this.fileStats.ctime;
      this.fileModifiedDate = this.fileStats.mtime;
      const File = await open(this.filePath);
      for await (const line of File.readLines({ encoding: this.encoding })) {
        returnLines.push(line.split(this.seperator));
      }
      await File.close();
    }
    return returnLines;
  }
}
