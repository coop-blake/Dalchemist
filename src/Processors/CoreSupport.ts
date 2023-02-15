import xlsx from "node-xlsx";

export class CoreSupport {
  lineCount = 0;
  filePath = "";
  entries = new Map<string, Array<any>>();

  constructor(
    filePath = `./Data/Inputs/Core_Sets_Cost_Support_Price_List_2023_Feb.xlsx`
  ) {
    this.filePath = filePath;

    try {
      const workSheetsFromFile = xlsx.parse(this.filePath);

      const data = workSheetsFromFile[0]?.data;

      if (Array.isArray(data))
        data.forEach((row, index) => {
          if (Array.isArray(row)) {
            this.processLineArray(row, index);
          } else {
            //Alert that the core support file is not supported
            throw "Core support file is not supported, expecting Array";
          }
        });
    } catch (Error) {
      //Alert that the core support file is not supported
      console.log(Error);
    }
    console.log(this.entries);

    console.log(this.entries.size);
  }

  processLineArray(lineArray: string[], lineNumber: number): boolean {
    switch (lineNumber) {
      case 0:
        //First line
        if (lineArray[0] !== undefined && lineArray[18].trim() != "East") {
          throw `First line of worksheet not expected: ${lineArray.join("\t")}`;
        }
        break;
      case 1:
        //second line
        if (
          lineArray[0] === undefined ||
          lineArray[0].trim() !== "Line Number"
        ) {
          throw `Second line of worksheet not expected: ${lineArray.join(
            "\t"
          )}`;
        }
        break;
      default:
        {
          const lineNumberFromData = lineArray[0];
          if (
            lineNumberFromData === undefined ||
            typeof lineNumberFromData !== "number"
          ) {
            throw `Second line of worksheet not expected: ${lineArray.join(
              "\t"
            )}`;
          } else {
            this.entries.set(lineNumber, lineArray);
          }
        }
        break;
    }
  }
}
