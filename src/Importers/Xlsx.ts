import { InputLines } from "./Base";

import xlsx from "node-xlsx";
import { stat } from "fs/promises";
import { existsSync, Stats } from "fs";

import * as path from "path";

export class XlsxInput implements InputLines {
  filePath: string;
  fileCreatedDate: Date | null = null;
  fileModifiedDate: Date | null = null;
  fileStats: Stats | null = null;
  fileName: string | null = null;

  constructor(filePath: string) {
    this.filePath = path.resolve(filePath);
  }

  async getLines() {
    const returnLines = Array<Array<string>>();
    if (existsSync(this.filePath)) {
      this.fileStats = await stat(this.filePath);
      this.fileCreatedDate = this.fileStats.ctime;
      this.fileModifiedDate = this.fileStats.mtime;

      const workSheetsFromFile = xlsx.parse(this.filePath);
      const data = workSheetsFromFile[0]?.data;
      return data;
    }
    return returnLines;
  }
}
