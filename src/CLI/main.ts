import { program } from "commander";
import { testGoogle } from "./Google/Test";
import { testPromos } from "./Promos/Test";

program.description("Dalchemist command line interface").version("0.0.1");

/**
 * Promo Commands
 */
program
  .command("promos:check")
  .description("Check promos for consistency")
  .action(async () => {
    console.log("Checking promos for consistency");
    await testPromos();
    console.log("Promo Check Complete");
    process.exit(0);
  });

/**
 * Google Commands
 */
program
  .command("google:test <sheetID>")
  .description("Test the Google API on a sheetID")
  .action(async (sheetID) => {
    console.log(sheetID);

    if (!sheetID || sheetID === undefined) {
      console.error("Error: Sheet ID is required.");
      process.exit(1);
    } else {
      console.log(`Testing Google API with Sheet ID: ${sheetID}`);
      try {
        await testGoogle(sheetID);
      } catch (e) {
        console.log("Error: ");
      }
    }
  });

/**
 * Update Command
 */
program
  .command("dumpToSheet <sqlFile> <sheetID> <sheetName> <sheetRange>")
  .description("Test the Google API on a sheetID")
  .action(async (sqlFile, sheetID, sheetName, sheetRange) => {
    console.log(sheetID);

    if (
      !sheetID ||
      sheetID === undefined ||
      !sqlFile ||
      sqlFile === undefined ||
      !sheetName ||
      sheetName === undefined ||
      !sheetRange ||
      sheetRange === undefined
    ) {
      console.error(
        "Error: Missing arguments, expeting: dumpToSheet <sqlFile> <sheetID> <sheetName> <sheetRange>."
      );
      process.exit(1);
    } else {
      console.log(`Using ${sqlFile} to dump to : ${sheetID}
      Into ${sheetName} at ${sheetRange}`);
      try {
        // await testGoogle(sheetID);
      } catch (e) {
        //console.log("Error: ");
      }
    }
  });

program.parse(process.argv);
