/**
 * When ran by node this file returns a comma seperated list of items
 * found in both the Inventory and Pricechange files
 *
 * Import the Inventory And Pricechange Importers
 * @module UNFIPriceChangeInventory
 * @category UNFI Price Change
 * @internal
 */

import InventoryImporter from "../TextImporters/Inventory";
import PriceChangeImporter from "../TextImporters/PriceChange";

//Create new Import objects
const InventoryImport = new InventoryImporter();
const PriceChangeImport = new PriceChangeImporter();

//Tell them to load their entries
InventoryImport.start()
  .then(() => {
    PriceChangeImport.start()
      .then(() => {
        //Filter Inventory Entries for Items in included in the Pricechange
        const InventoryItemsInPriceChange = [
          ...InventoryImport.entries.values(),
        ]
          .filter(function (InventoryEntry) {
            const scanCode = InventoryEntry.scanCode || "";
            const PriceChangeEntry =
              PriceChangeImport.getEntryFromUPC(scanCode);

            return PriceChangeEntry ? true : false;
          }) //and map to an array of entries
          .map(function (entry) {
            return entry;
          });

        //Create Comma seperated string of scancodes from the items in both files
        let csvString = "";
        InventoryItemsInPriceChange.forEach(function (entry) {
          csvString = csvString + `,${entry.scanCode}`;
        });

        //Output the string to the console
        console.log(csvString.substring(1));
      })
      .catch((error: Error) => {
        console.error(error);
      });
  })
  .catch((error) => {
    console.error(error);
  });
