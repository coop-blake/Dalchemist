import { Google } from "../../Google/google";
import * as fs from "fs";
import * as path from "path";
import odbc from "odbc";

export async function dumpToSheet(
  dsn: string,
  sqlFile: string,
  sheetID: string,
  sheetRange: string
) {
  return new Promise((resolve) => {
    //Check that sqlFile exists relative to working dir
    const sqlFilePath = path.join(process.cwd(), sqlFile);
    if (!fs.existsSync(sqlFilePath)) {
      throw new Error(`SQL file does not exist: ${sqlFilePath}`);
    }
    //Read the Query
    const sqlQuery = fs.readFileSync(sqlFilePath, "utf8");

    console.log("Read SQL, Connecting To Data Source");
    //Connect to Data Sourse
    odbc.connect(`DSN=${dsn}`, (error, connection) => {
      connection.query(sqlQuery, (error, result) => {
        if (error) {
          console.error(error);
          resolve(false);
        }
        const header = Object.keys(result[0] as object);

        const data = result.map((row) => Object.values(row as Array<string>));
        console.log(header);

        uploadArrayToSheet([header, ...data], sheetID, sheetRange).then(() => {
          resolve(true);
        });
      });
    });
  });
}

async function uploadArrayToSheet(
  data: Array<Array<string>>,
  sheetID: string,
  sheetRange: string
) {
  //Take the result and dump it to the sheet
  return new Promise((resolve) => {
    const timeoutId = setTimeout(() => {
      console.log("Timed out waiting for Google API");
      resolve(false);
    }, 10000);

    Google.getLoaded().subscribe(async (loaded: string[]) => {
      clearTimeout(timeoutId);

      const googleInstance = Google.getInstanceFor(loaded[0]);

      // test googleInstance for sheets and drive
      if (googleInstance.getSheets() && googleInstance.getDrive()) {
        console.log("Uploading to Sheet ID: ", sheetID);
        console.log("At Range: ", sheetRange);

        const sheets = googleInstance.getSheets();

        try {
          await sheets.spreadsheets.values.clear({
            spreadsheetId: sheetID, // spreadsheet id
            range: sheetRange, //range of cells to read from.
          });
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          await sheets.spreadsheets.values.update({
            spreadsheetId: sheetID, //spreadsheet id
            range: sheetRange, //sheet name and range of cells
            valueInputOption: "RAW", // The information will be passed according to what the usere passes in as date, number or text
            resource: {
              values: data,
            },
          });
          console.log(`Uploaded: ${data.length} Rows`);

          resolve(true);
        } catch (e) {
          console.log(`Error ${e}`);
          resolve(false);
        }
      }
    });
  });
}
