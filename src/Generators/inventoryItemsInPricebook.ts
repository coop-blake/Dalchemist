//When ran by node this file returns a comma seperated list of items
//found in both the Inventory and Pricebook files

//Import the Inventory And Pricebook Importers
import InventoryTextImporter from "../TextImporters/Inventory";
import PricebookTextImporter from "../TextImporters/Pricebook";

//Create new Import objects
const InventoryImport = new InventoryTextImporter();
const PricebookImport = new PricebookTextImporter();

//Tell them to load their entries
await InventoryImport.start();
await PricebookImport.start();

//Filter Inventory Entries for Items in included in the Pricebook
const InventoryItemsInPricebook = Object.entries(
  InventoryImport.processedValues
)
  .filter(function (InventoryEntry) {
    const scanCode = InventoryEntry[1]?.scanCode || "";
    const PricebookEntry = PricebookImport.getEntryFromUPC(scanCode);

    return PricebookEntry ? true : false;
  }) //and map to an array of entries
  .map(function (entry) {
    return entry[1];
  });

//Create Comma seperated string of scancodes from the items in both files
let csvString = "";
InventoryItemsInPricebook.forEach(function (entry) {
  csvString = csvString + `,${entry.scanCode}`;
});

//Output the string to the console
console.log(csvString.substring(1));
