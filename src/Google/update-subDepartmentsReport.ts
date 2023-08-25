import { google } from "googleapis";

import fs from "fs";
import path from "path";

import InventoryImporter from "../TextImporters/Inventory";
import SubMarginsImporter from "../TextImporters/SubMargins";

start()
  .then(() => {
    console.log("Sub margin check completed successfully");
  })
  .catch((error) => {
    console.error(error.message);
  });

async function start() {
  console.log("starting");

  console.log("Reading North Inventory -Preparing Data");
  const NorthInventoryImport = new InventoryImporter();
  const subMarginsImporter = new SubMarginsImporter();

  NorthInventoryImport.textFilePath =
    "./src/Google/Inventory/fetches/North.txt";
  await NorthInventoryImport.start()
    .then(() => {
      subMarginsImporter
        .start()
        .then(async () => {
          const InventoryItemsToReport = [
            ...NorthInventoryImport.entries.values(),
          ]
            .filter(function (InventoryEntry) {
              const subDepartment = InventoryEntry.subdepartment || "";
              const currentMargin = InventoryEntry.idealMargin || "";

              const expectedMargin =
                subMarginsImporter.getEntryFromSubDepartment(subDepartment)
                  ?.margin;

              if (
                expectedMargin &&
                expectedMargin.substring(0, 30).valueOf() ===
                  currentMargin.substring(0, 30).valueOf()
              ) {
                return false;
              } else {
                return true;
              }
            }) //and map to an array of entries
            .map(function (entry) {
              const expectedMargin =
                subMarginsImporter.getEntryFromSubDepartment(
                  entry.subdepartment
                )?.margin;

              return [
                entry.scanCode,
                expectedMargin,
                entry.idealMargin,
                entry.subdepartment,
                entry.department,
                entry.brand,
                entry.name,
              ];
            });

          const InventoryItemsToReportWithHeader = [
            [
              "Scan Code",
              "Expected Margin",
              "Set Margin",
              "Sub Department",
              "Department",
              "Brand",
              "Name",
            ],
            ...InventoryItemsToReport,
          ];
          console.log("Logging into Google");

          const auth = new google.auth.GoogleAuth({
            keyFilename: "./src/Google/Inventory/CertAndLogs/googleCert.json",
            // Scopes can be specified either as an array or as a single, space-delimited string.
            scopes: ["https://www.googleapis.com/auth/drive"],
          });

          const authClient = await auth.getClient();

          const sheets = google.sheets({ version: "v4", auth: authClient });
          const spreadsheetId = "1HdBg3Ht1ALFTBkCXK1YA1cx0vZ9hPx8Ji9m0qy3YMnA"; //acitive id

          //          const spreadsheetId = "1aMcYYPwlH1sllW_DxUWVS-lT0t0QWwTTO3pm7WY4UJk";

          console.log("Clearing Inventory Google Sheet");

          const readData = await sheets.spreadsheets.values.clear({
            spreadsheetId, // spreadsheet id
            range: "SubMarginsReport!A:G", //range of cells to read from.
          });

          console.log("Uploading Inventory Google Sheet");

          await sheets.spreadsheets.values.update({
            spreadsheetId, //spreadsheet id
            range: "SubMarginsReport!A3:G", //sheet name and range of cells
            valueInputOption: "USER_ENTERED", // The information will be passed according to what the usere passes in as date, number or text
            resource: {
              values: InventoryItemsToReportWithHeader,
            },
          });
        })
        .catch((err) => {});

      //Output the string to the console
    })
    .catch((error) => {
      console.error;
    });
}
