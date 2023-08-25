import { google } from "googleapis";
const { spawn } = require("child_process");

import fs from "fs";
import path from "path";

import InventoryImporter from "../TextImporters/Inventory";

// Path to the cscript executable
const cscriptPath = "C:\\Windows\\System32\\cscript.exe"; // Update with the correct path

// Path to your VBScript file
const vbscriptFilename = "Inventory/Get.vbs";
const currentDirectory = __dirname;
const vbscriptPath = path.join(currentDirectory, vbscriptFilename);

// Arguments for the cscript command
const args: string[] = [vbscriptPath];

// Spawn the child process
const cscriptProcess = spawn(cscriptPath, args);

// Listen for data from the child process (stdout)
cscriptProcess.stdout.on("data", (data: Buffer) => {
  console.log(`VBScript Output: ${data}`);
});

// Listen for any errors
cscriptProcess.on("error", (error: Error) => {
  console.error(`Error executing VBScript: ${error.message}`);
});

// Listen for the process to close
cscriptProcess.on("close", (code: number) => {
  switch (code) {
    case 1:
      console.log(`VBScript process exited with code ${code} Not Starting`);
      break;
    default:
      console.log(`VBScript process exited with code ${code}`);
      start().then(() => {});
  }
});

async function sendVBScriptError() {}

async function start() {
  console.log("starting");

  const logFilePath = "./src/Google/Inventory/CertAndLogs/ScriptLog.txt";
  const numLinesToRead = 10;

  console.log("Reading North Inventory -Preparing Data");
  const NorthInventoryImport = new InventoryImporter();

  NorthInventoryImport.textFilePath =
    "./src/Google/Inventory/fetches/North.txt";
  await NorthInventoryImport.start();
  console.log("Reading South Inventory -Preparing Data");

  const SouthInventoryImport = new InventoryImporter();
  SouthInventoryImport.textFilePath =
    "./src/Google/Inventory/fetches/South.txt";
  await SouthInventoryImport.start();

  console.log("Combining Data");

  const values = [
    [
      "Scan Code",
      "Default Supplier",
      "Department",
      "Brand",
      "Name",
      "Size",
      "Receipt Alias",
      "Base Price",
      "Last Cost",
      "Average Cost",
      "Sub Department",
      "Ideal Margin",
      "Quantity",
      "Unit",
      "Supplier Unit ID",
      "N", //Disco Light
      "S", //Disco Light
      "North LSD",
      "South LSD",
    ],
  ];

  NorthInventoryImport.forEachEntry(function (entry) {
    const valueArray = entry.valuesArray.map((s) => s.trim());
    const scanCode = entry.scanCode;
    const SouthSoldDate = SouthInventoryImport.getEntryFromScanCode(
      entry.scanCode
    )?.southLastSoldDate;
    let SouthDisco = SouthInventoryImport.getEntryFromScanCode(entry.scanCode)
      ?.invDiscontinued;

    SouthDisco = SouthDisco == "1" ? "🔴" : "🟢";
    valueArray.push(SouthSoldDate ? SouthSoldDate : "");
    valueArray.splice(9, 0, SouthDisco ? SouthDisco : 0);

    let NorthDisco = valueArray.splice(5, 1)[0];
    NorthDisco = NorthDisco == "1" ? "🔴" : "🟢";

    const NorthLSD = valueArray.splice(17, 1)[0].split(" ")[0];
    const SouthLSD = valueArray.splice(17, 1)[0].split(" ")[0];

    // Insert the item at the new position
    valueArray.splice(8, 0, NorthDisco);
    valueArray.splice(6, 1);

    valueArray.splice(9, 0, SouthLSD);
    valueArray.splice(9, 0, NorthLSD);

    valueArray.splice(1, 0, valueArray.splice(17, 1)[0]); //move Supplier to first column
    valueArray.splice(12, 0, valueArray.splice(13, 1)[0]); //move Base Price
    valueArray.push(valueArray.splice(13, 1)[0]); //move supplier ID to end
    valueArray.splice(16, 0, valueArray.splice(13, 1)[0]); //move supplier quantity
    valueArray.splice(14, 0, valueArray.splice(6, 1)[0]); //move Base Price

    valueArray.splice(18, 0, valueArray.splice(7, 1)[0]); //move SOld Info
    valueArray.splice(18, 0, valueArray.splice(7, 1)[0]); //move SOld Info

    valueArray.splice(18, 0, valueArray.splice(7, 1)[0]); //move SOld Info
    valueArray.splice(18, 0, valueArray.splice(7, 1)[0]); //move SOld Info
    valueArray.splice(2, 0, valueArray.splice(6, 1)[0]); //move Department

    values.push(valueArray);
  });

  console.log("Logging into Google");

  const auth = new google.auth.GoogleAuth({
    keyFilename: "./src/Google/Inventory/CertAndLogs/googleCert.json",
    // Scopes can be specified either as an array or as a single, space-delimited string.
    scopes: ["https://www.googleapis.com/auth/drive"],
  });

  const authClient = await auth.getClient();

  const sheets = google.sheets({ version: "v4", auth: authClient });
  const spreadsheetId = "1HdBg3Ht1ALFTBkCXK1YA1cx0vZ9hPx8Ji9m0qy3YMnA"; //acitive id

  //  const spreadsheetId = "1aMcYYPwlH1sllW_DxUWVS-lT0t0QWwTTO3pm7WY4UJk"; //dev id

  console.log("Clearing Inventory Google Sheet");
  await sheets.spreadsheets.values.clear({
    spreadsheetId, // spreadsheet id
    range: "Inventory!A:S", //range of cells to read from.
  });

  console.log("Uploading Inventory Google Sheet");

  await sheets.spreadsheets.values.update({
    spreadsheetId, //spreadsheet id
    range: "Inventory!A:T", //sheet name and range of cells
    valueInputOption: "USER_ENTERED", // The information will be passed according to what the usere passes in as date, number or text
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

  await sheets.spreadsheets.values.update({
    spreadsheetId, //spreadsheet id
    range: "Status!B1", //sheet name and range of cells
    valueInputOption: "USER_ENTERED", // The information will be passed according to what the usere passes in as date, number or text
    resource: {
      values: [[now]],
    },
  });

  const logLines = await readLastLines(logFilePath, numLinesToRead);

  sheets.spreadsheets.values.update({
    spreadsheetId,
    range: "Status!B6:B100",
    valueInputOption: "USER_ENTERED",
    resource: {
      values: logLines.map((line) => [line]),
    },
  });
}

async function readLastLines(filePath, numLines) {
  const lines = [];
  const stream = fs.createReadStream(filePath, { encoding: "utf8" });
  let buffer = "";

  await new Promise((resolve, reject) => {
    stream.on("data", (chunk) => {
      buffer += chunk;
      const linesArray = buffer.split("\n");
      while (linesArray.length > 1) {
        if (lines.length >= numLines) {
          lines.shift(); // Remove the first line when we have numLines
        }
        lines.push(linesArray.shift());
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
