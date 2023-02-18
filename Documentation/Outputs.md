# Outputs

## Generating
These commands are ment to be issued from the [project root directory](../) that contains the [package.json](../package.json) file with the commands outlined below.

The results of these commands will be output to the [Data/Ouputs](../Data/Outputs/) directory.  

### All Outputs
To Generate All Outputs:  

`npm run outputAll`

## Price Change Worksheets Vs Inventory Comparison
This generator imports any Price Change Worksheets that have been exported from Catapult and placed in the [Data/Inputs/Price Change Worksheets](../Data/Inputs/Price%20Change%20Worksheets/) directory.

It uses these Price Change Worksheets and the Inventory Text Importer to generate a list of Sale Items with inconsistent pricing.  

To generate a list with higher sale than base prices and items on different sales worksheet with inconsitent pricing issue:  

`npm run checkPriceChangeWorksheetsAndInventory`

To generate the above list and include all items on multiple worksheets and items with same base price vs sale price

`npm run checkPriceChangeWorksheetsAndInventory-AllOuput`

## UNFI Price Book Vs Inventory Comparison

To generate a comma seperated list of all items in the pricebook and inventory file:  
`npm run inventoryItemsInPricebook`

For a tab seperated value file with header[scan code, Last Cost, UNFI Cost, Ideal Margin, Proposed Price, Base Price, Difference(Base price - UNFI Cost calculated proposed price), and Description]

`npm run lowerCostsInventoryPricebookComparison`
