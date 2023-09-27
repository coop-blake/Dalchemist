import { google } from "googleapis";
import { spawn } from "child_process";

import fs from "fs";
import path from "path";

import PriceChangeDataImporter from "../TextImporters/PriceChangeData";

// Path to the cscript executable
const cscriptPath = "C:\\Windows\\System32\\cscript.exe"; // Update with the correct path

// Path to your VBScript file
const vbscriptFilename = "Inventory/GetActivePriceChangeItems.vbs";
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

//async function sendVBScriptError() {}
const priceChangeDataImporter = new PriceChangeDataImporter();
async function start() {
  console.log("starting");
  console.log("Reading South Inventory -Preparing Data");

  const combindedItems = [
    ["Scan Code", "Price", "Discount", "Worksheet", "Start Date", "End Date"],
  ];

  priceChangeDataImporter.textFilePath = "./src/Google/Inventory/fetches/PriceChangeData.txt";
  await priceChangeDataImporter.start();


  priceChangeDataImporter.forEachEntry(function (entry) {
    // console.log(entry);

    combindedItems.push([
      entry.scanCode,
      entry.price,
      entry.discount,
      entry.worksheet,
      entry.startDate,
      entry.endDate
    ]);
  });

  console.log("Logging into Google");

  const auth = new google.auth.GoogleAuth({
    keyFilename: "./src/Google/Inventory/CertAndLogs/googleCert.json",
    // Scopes can be specified either as an array or as a single, space-delimited string.
    scopes: ["https://www.googleapis.com/auth/drive"],
  });

  //const authClient = await auth.getClient();

  const sheets = google.sheets({ version: "v4", auth: auth });
  const spreadsheetId = "1HdBg3Ht1ALFTBkCXK1YA1cx0vZ9hPx8Ji9m0qy3YMnA"; //acitive id

  //   //  const spreadsheetId = "1aMcYYPwlH1sllW_DxUWVS-lT0t0QWwTTO3pm7WY4UJk"; //dev id

  console.log("Clearing AltIDs to Google Sheet");
  await sheets.spreadsheets.values.clear({
    spreadsheetId, // spreadsheet id
    range: "Promos!A:F", //range of cells to read from.
  });

  console.log("Uploading AltIDs to Google Sheet");

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  await sheets.spreadsheets.values.update({
    spreadsheetId, //spreadsheet id
    range: "Promos!A:F", //sheet name and range of cells
    valueInputOption: "USER_ENTERED", // The information will be passed according to what the usere passes in as date, number or text
    resource: {
      values: combindedItems,
    },
  });
}
