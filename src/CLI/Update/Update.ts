import { Google } from "../../Google/google";
import * as fs from "fs";
import * as path from "path";
import odbc from "odbc";

export async function dumpToSheet(
  dsn: string,
  sqlFile: string,
  sheetID: string,
  sheetName: string,
  sheetRange: string
) {
  return new Promise(async (resolve) => {
    //Check that sqlFile exists relative to working dir
    const sqlFilePath = path.join(process.cwd(), sqlFile);
    if (!fs.existsSync(sqlFilePath)) {
      throw new Error("SQL file does not exist");
    }
    //The sql file should conatin a single query
    //read the file and execute the query

    const sqlQuery = fs.readFileSync(sqlFilePath, "utf8");

    odbc.connect("DSN=Prototype", (error, connection) => {
      connection.query(sqlQuery, (error, result) => {
        if (error) {
          console.error(error);
        }
        console.log(result);
      });
    });
    //Take the result and dump it to the sheet

    const timeoutId = setTimeout(() => {
      console.log("Timed out waiting for Google API");
      resolve(false);
    }, 10000);

    Google.getLoaded().subscribe(async (loaded: string[]) => {
      clearTimeout(timeoutId);

      const googleInstance = Google.getInstanceFor(loaded[0]);
      // test googleInstance for sheets and drive
      if (googleInstance.getSheets() && googleInstance.getDrive()) {
        console.log("Testing Sheet ID: ", sheetID);

        try {
        } catch (e) {}
      }
    });
    resolve(true);
  });
}
