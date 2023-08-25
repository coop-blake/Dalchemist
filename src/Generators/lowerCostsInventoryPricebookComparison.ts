/**
 * Generates
 *    lowerCostsInventoryPriceBookComparison.txt
 *   A tab seperated text file for importing to excel
 * @module lowerCostsInventoryPriceBookComparison
 * @category UNFI Price Check
 * @internal
 */

//import PriceChecker processor
import PriceChecker from "../Processors/PriceChecker";
//Create new PriceChecker
const priceChecker = new PriceChecker();
//Initialize to load input files
priceChecker
  .initialize()
  .then(() => {
    //Get and print output to console
    console.log(priceChecker.getLowerCostOutput());
  })
  .catch((error) => {
    console.log(error);
  });
