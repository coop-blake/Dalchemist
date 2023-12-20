import { Inventory } from "../../Google/Inventory/Inventory";

import { SubDepartmentMargins } from "../../Google/Inventory/SubDepartmentMargins";

import SubMarginsImporter from "../../TextImporters/SubMargins";

import { google } from "googleapis";

const inventoryImporter = Inventory.getInstance();

const subMarginsImporter = new SubMarginsImporter();

const subMargins = SubDepartmentMargins.getInstance();

export async function getItemsWithInconsitantSubMargins() {
  await Inventory.state.onLoaded();
  await subMarginsImporter.start();

  const InventoryItemsToReport = [...inventoryImporter.entries.values()]
    .filter(function (InventoryEntry) {
      const subDepartment = InventoryEntry.SubDepartment || "";
      const currentMargin = InventoryEntry.IdealMargin || "";

      const expectedMargin = subMargins.getMarginFor(subDepartment);

      if (
        expectedMargin &&
        parseFloat(expectedMargin) === parseFloat(currentMargin)
      ) {
        return false;
      } else {
        return true;
      }
    })
    .map(function (entry) {
      const expectedMargin = subMargins.getMarginFor(entry.SubDepartment);

      return [
        entry.ScanCode,
        expectedMargin,
        entry.IdealMargin,
        entry.SubDepartment,
        entry.Department,
        entry.Brand,
        entry.Name,
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

  return InventoryItemsToReportWithHeader;
}

export async function testSubMargins() {
  const values = await getItemsWithInconsitantSubMargins();

  const auth = new google.auth.GoogleAuth({
    keyFilename: "./src/Google/Inventory/CertAndLogs/googleCert.json",
    // Scopes can be specified either as an array or as a single, space-delimited string.
    scopes: ["https://www.googleapis.com/auth/drive"],
  });

  //const authClient = await auth.getClient();

  const sheets = google.sheets({ version: "v4", auth: auth });
  const spreadsheetId = "1HdBg3Ht1ALFTBkCXK1YA1cx0vZ9hPx8Ji9m0qy3YMnA"; //acitive id

  //          const spreadsheetId = "1aMcYYPwlH1sllW_DxUWVS-lT0t0QWwTTO3pm7WY4UJk";

  console.log("Clearing Inventory Google Sheet");

  await sheets.spreadsheets.values.clear({
    spreadsheetId, // spreadsheet id
    range: "SubMarginsReport!A:G", //range of cells to read from.
  });

  console.log("Uploading Inventory Google Sheet");

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  await sheets.spreadsheets.values.update({
    spreadsheetId, //spreadsheet id
    range: "SubMarginsReport!A2:G", //sheet name and range of cells
    valueInputOption: "USER_ENTERED", // The information will be passed according to what the usere passes in as date, number or text
    resource: {
      values: values,
    },
  });
}
