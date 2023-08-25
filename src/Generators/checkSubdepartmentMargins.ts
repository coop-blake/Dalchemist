/**
 * @module subDepartmentMarginCheck
 * @category Data Tests
 * @internal
 * @example
 *
 * npm run outputToFileCheckSubdepartmentMargins
 */

//When ran by node this file checks suberdepartment margins of all
//inventory Entries

//Import the Inventory And PriceBook Importers
import InventoryImporter from "../TextImporters/Inventory";
import SubMarginsImporter from "../TextImporters/SubMargins";

//Create new Import objects
const InventoryImport = new InventoryImporter();
const subMarginsImporter = new SubMarginsImporter();

//Tell them to load their entries
InventoryImport.start()
  .then(() => {
    subMarginsImporter
      .start()
      .then(() => {
        const InventoryItemsInPriceBook = [...InventoryImport.entries.values()]
          .filter(function (InventoryEntry) {
            const subDepartment = InventoryEntry.subdepartment || "";
            const currentMargin = InventoryEntry.idealMargin || "";

            const expectedMargin =
              subMarginsImporter.getEntryFromSubDepartment(
                subDepartment
              )?.margin;

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
            return entry;
          });

        //Create Comma seperated string of scancodes from the items in both files
        let csvString = "";
        InventoryItemsInPriceBook.forEach(function (entry) {
          const expectedMargin = subMarginsImporter.getEntryFromSubDepartment(
            entry.subdepartment
          )?.margin;
          csvString =
            csvString +
            `${entry.scanCode}  ${expectedMargin} ${entry.idealMargin}  ${entry.subdepartment}  ${entry.brand} ${entry.name}\r\n`;
        });

        console.log(csvString);
      })
      .catch((err) => {});

    //Output the string to the console
  })
  .catch((error) => {
    console.error;
  });
