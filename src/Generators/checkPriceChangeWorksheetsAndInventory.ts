// Generates
//      checkPriceChangeWorksheetsAndInventory.txt
//      checkPriceChangeWorksheetsAndInventoryAllOutput.txt
//
//   Output changes based on these flags:
//      --show-multiple-worksheet-items
//      --show-same-priced-items
//      --hide-higher-priced-items
//      --hide-items-with-inconsistent-worksheets
//import the data processor for price change worksheet comparisons
import PriceChangeWorksheetInventoryComparisons from "../Processors/PriceChangeWorksheetInventoryComparisons";
//create a new price change worksheet processor
const priceChangeWorksheetInventoryComparisons =
  new PriceChangeWorksheetInventoryComparisons();
//initialize processor to load price change worksheets in directory
priceChangeWorksheetInventoryComparisons
  .initialize()
  .then(() => {
    //get the text ouput for the loaded files
    //The get output looks for the accepted arguments and adjust output accordingly
    console.log(priceChangeWorksheetInventoryComparisons.getOutput());
  })
  .catch((error) => {
    console.log(error);
  });
