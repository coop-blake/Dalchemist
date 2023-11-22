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

program
  .command("google:update")
  .description("Retrieves Catapult data and updates the Google sheet")
  .action(() => {
    console.log(`Updating google sheet`);
  });

program
  .command("catapult:test")
  .description("Tests Catapult connection")
  .action(() => {
    console.log(`Testing catapult connection`);
  });
program.parse(process.argv);
