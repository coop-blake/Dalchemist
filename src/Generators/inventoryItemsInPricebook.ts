/**
 
 * 
 * When ran by node this file returns a comma seperated list of item IDs
 * found in both the Inventory and PriceBook files
 * 
 * Import the Inventory And PriceBook Importers
 * 
 * @module InventoryItemsInPricebook
 * @category UNFI Price Check
 * @internal
 */

import InventoryImporter from "../TextImporters/Inventory";
import PriceBookTextImporter from "../TextImporters/PriceBook";

//Create new Import objects
const InventoryImport = new InventoryImporter();
const PriceBookImport = new PriceBookTextImporter();

//Tell them to load their entries
InventoryImport.start()
  .then(() => {
    PriceBookImport.start()
      .then(() => {
        //Filter Inventory Entries for Items in included in the PriceBook
        const InventoryItemsInPriceBook = [...InventoryImport.entries.values()]
          .filter(function (InventoryEntry) {
            const scanCode = InventoryEntry.scanCode || "";
            const PriceBookEntry = PriceBookImport.getEntryFromUPC(scanCode);

            return PriceBookEntry ? true : false;
          }) //and map to an array of entries
          .map(function (entry) {
            return entry;
          });

        //Create Comma seperated string of scancodes from the items in both files
        let csvString = "";
        InventoryItemsInPriceBook.forEach(function (entry) {
          csvString = csvString + `,${entry.scanCode}`;
        });

        //Output the string to the console
        console.log(csvString.substring(1));
      })
      .catch((error) => {
        console.error;
      });
  })
  .catch((error) => {
    console.error;
  });
