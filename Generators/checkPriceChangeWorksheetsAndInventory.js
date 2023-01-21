// Generates 
//      checkPriceChangeWorksheetsAndInventory.txt
//      checkPriceChangeWorksheetsAndInventoryAllOutput.txt
//
//   Output changes based on these flags:  
//      --show-multiple-worksheet-items
//      --show-same-priced-items
//      --hide-higher-priced-items
//      --hide-items-with-inconsitent-worksheets

//import the data processor for price change worksheet comparisons
import PriceChangeWorksheetInventoryComparisons from '../Processors/PriceChangeWorksheetInventoryComparisons.js'
//create a new price change worksheet processor
let priceChangeWorksheetInventoryComparisons = new PriceChangeWorksheetInventoryComparisons
//initialize processor to load price change worksheets in directory
await priceChangeWorksheetInventoryComparisons.initialize()
//get the text ouput for the loaded files
//The get output looks for the accepted arguments and adjust output accordingly
console.log(priceChangeWorksheetInventoryComparisons.getOutput())
