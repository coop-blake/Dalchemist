// Generates 
//      lowerCostsInventoryPricebookComparison.txt
//      A tab seperated text file for importing to excel

//import PriceChecker processor
import PriceChecker from '../Processors/PriceChecker.js'
//Create new PriceChecker
let priceChecker = new PriceChecker
//Initialize to load input files
await priceChecker.initialize()
//Get and print output to console
console.log(priceChecker.getLowerCostOutput())
