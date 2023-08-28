import { google } from "googleapis";
import fs from "fs";


import InventoryImporter from "../TextImporters/Inventory";

async function start() {
  console.log("starting");

  const logFilePath = './Data/Inputs/Inventory/ScriptLog.txt';
  const numLinesToRead = 10;
  const logLines = await readLastLines(logFilePath, numLinesToRead);

  console.log("Reading North Inventory -Preparing Data");
  const NorthInventoryImport = new InventoryImporter();

  NorthInventoryImport.textFilePath = "./Data/Inputs/Inventory/NorthInventory.txt"
  await NorthInventoryImport.start();
  console.log("Reading South Inventory -Preparing Data");

  const SouthInventoryImport = new InventoryImporter();
  SouthInventoryImport.textFilePath =  "./Data/Inputs/Inventory/SouthInventory.txt"
  await SouthInventoryImport.start();

 
  console.log("Combining Data");

  const values = [
    [
      "Scan Code",
      "Brand",
      "Name",
      "Size",
      "Receipt Alias",
      "inv_discontinued",
      "Subdepartment",
      "sto_number",
      "Department",
      "Supplier Unit ID",
      "BasePrice",
      "Quantity",
      "LastCost",
      "AverageCost",
      "Ideal Margin",
      "Default Supplier",
      "Unit",
      "North_LastSoldDate",
      "South_LastSoldDate",
    ],
  ];
  NorthInventoryImport.forEachEntry(function (entry) {
    const valueArray = entry.valuesArray.map((s) => s.trim());
    const scanCode = entry.scanCode
   const SouthSoldDate = SouthInventoryImport.getEntryFromScanCode(scanCode)?.southLastSoldDate

   valueArray.push(SouthSoldDate ? SouthSoldDate : "")
    values.push(valueArray);
  });
  console.log("Logging into Google");

  const auth = new google.auth.GoogleAuth({
    keyFilename: "./Data/Inputs/Inventory/googleCert.json",
    // Scopes can be specified either as an array or as a single, space-delimited string.
    scopes: ["https://www.googleapis.com/auth/drive"],
  });

  //const authClient = await auth.getClient();

  const sheets = google.sheets({ version: "v4", auth: auth });
  const spreadsheetId = "1HdBg3Ht1ALFTBkCXK1YA1cx0vZ9hPx8Ji9m0qy3YMnA";

  console.log("Clearing Inventory Google Sheet");

 await sheets.spreadsheets.values.clear({
    spreadsheetId, // spreadsheet id
    range: "Inventory!A:S", //range of cells to read from.
  });

  console.log("Uploading Inventory Google Sheet");

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore 
  await sheets.spreadsheets.values.update({
    spreadsheetId, //spreadsheet id
    range: "Inventory!A:S", //sheet name and range of cells
    valueInputOption: "RAW", // The information will be passed according to what the usere passes in as date, number or text
    resource: {
      values: values,
    },
  });
  const now = new Date().toLocaleDateString("en-us", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore 
  await sheets.spreadsheets.values.update({
    spreadsheetId, //spreadsheet id
    range: "About!B1", //sheet name and range of cells
    valueInputOption: "USER_ENTERED", // The information will be passed according to what the usere passes in as date, number or text
    resource: {
      values: [[now]],
    },
  });
  
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore 
  await sheets.spreadsheets.values.update({
    spreadsheetId, //spreadsheet id
    range: "About!B6:B100", //sheet name and range of cells
    valueInputOption: "USER_ENTERED", // The information will be passed according to what the usere passes in as date, number or text
    resource: {
      values: logLines.map(line => [line]),
    },
  });
}

async function readLastLines(filePath: string, numLines: number) {
  const lines : string[] = [];
  const stream = fs.createReadStream(filePath, { encoding: "utf8" });
  let buffer = "";

  await new Promise<void>((resolve, reject) => {
    stream.on("data", (chunk) => {
      buffer += chunk;
      const linesArray = buffer.split("\n");
      while (linesArray.length > 1) {
        if (lines.length >= numLines) {
          lines.shift(); // Remove the first line when we have numLines
        }
        lines.push(linesArray.shift() || "");
      }
      buffer = linesArray[0];
    });

    stream.on("end", () => {
      // Add the remaining lines to the result
      if (buffer.length > 0) {
        lines.push(buffer);
      }
      resolve();
    });

    stream.on("error", (error) => {
      reject(error);
    });
  });

  return lines;
}



start().then(() => {});
