import { program } from "commander";
//import { testGoogle } from "./Google/Test";
//import { testPromos } from "./Promos/Test";
//import { testSubMargins } from "./SubMargins/Test";
//import * as path from "path";
import { dumpToSheet } from "./Update/Update";

import { info, warn, error, good } from "./chalkStyles";

program
  .name("dalchemist")
  .description("Dalchemist command line interface")
  .version("0.0.1")
  .usage("<command> [options]");

/**
 * Promo Commands
 */
// program
//   .command("Promos:check  [googleCert]")
//   .description("Check promos for consistency")
//   .action(async () => {
//     console.log("Checking promos for consistency");
//     await testPromos();
//     console.log("Promo Check Complete");
//     process.exit(0);
//   });

/**
 * Sub Department Margins Commands
 */
// program
//   .command("SubDepartmentMargins:check  [googleCert]")
//   .description("Check Sub Departments for consistency")
//   .action(async () => {
//     console.log("Checking Sub Department Margins for consistency");
//     await testSubMargins();
//     console.log("Sub Department Margin Check Complete");
//     process.exit(0);
//   });

/**
 * Google Commands
 */
// program
//   .command("google:test <sheetID>")
//   .description("Test the Google API on a sheetID")
//   .action(async (sheetID) => {
//     console.log(sheetID);

//     if (!sheetID || sheetID === undefined) {
//       console.error("Error: Sheet ID is required.");
//       process.exit(1);
//     } else {
//       console.log(`Testing Google API with Sheet ID: ${sheetID}`);
//       try {
//         await testGoogle(sheetID);
//       } catch (e) {
//         console.log("Error: ");
//       }
//     }
//   });

/**
 * Update Command
 */
program
  .command("dumpDSNToSheet <DSN> <sqlFile> <sheetID> <sheetRange> [googleCert]")
  .description("Query a DSN and dump the result to a sheet")
  .action(async (dsn, sqlFile, sheetID, sheetRange, googleCert) => {
    console.log(info("Dumping DSN Query to Sheet"));
    console.log(info("DSN: ", dsn));
    console.log(info("SQL File: ", sqlFile));
    console.log(info("Sheet ID: ", sheetID));
    console.log(info("Sheet Range: ", sheetRange));
    console.log(
      info("Google Cert: ", googleCert ? googleCert : "googleCert.json")
    );

    if (
      !dsn ||
      dsn === undefined ||
      !sheetID ||
      sheetID === undefined ||
      !sqlFile ||
      sqlFile === undefined ||
      !sheetRange ||
      sheetRange === undefined
    ) {
      console.error(
        "Error: Missing arguments, expecting: dumpToSheet <DSN> <sqlFile> <sheetID> <sheetRange> [googleCert]."
      );
      process.exit(1);
    } else {
      try {
        const success = await dumpToSheet(
          dsn,
          sqlFile,
          sheetID,
          sheetRange,
          googleCert
        );
        if (success === true) {
          console.log(good("Successesful Dump"));
          process.exit(0);
        } else {
          console.log(error("Something Unexpected Happened"));
          process.exit(1);
        }
      } catch (e) {
        console.log(error(`Error: ${e}`));
        process.exit(1);
      }
    }
  });

program.parse(process.argv);
