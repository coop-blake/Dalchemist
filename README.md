# Dalchemist...
Transmutes text file inputs

## Getting Started  

### Access through a web browser
`npm install`
`npm run start`

This will start a [localhost web server on port 4848](http://localhost:4848/)

### Generate File Outputs
Make sure you have the latest versions of input data in the Data/Inputs folder

To generate all output files in Data/Outputs:  
`npm run outputAll`


## Generate Console Outputs

### Price Change Worksheets Vs Inventory Comparison
To generate a list of Sale Items with higher then base prices and items on different sales worksheet with inconsitent pricing  
`npm run checkPriceChangeWorksheetsAndInventory`  

To generate the above list and include all items on multiple worksheets and items with same base price vs sale price

`npm run checkPriceChangeWorksheetsAndInventory-AllOuput`



### UNFI Price Change Vs Inventory Comparison
To generate a comma seperated list of all items in the pricebook and inventory file:  
`npm run inventoryItemsInPricebook`  

For a tab seperated value file with header[scan code, Last Cost, UNFI Cost, Ideal Margin, Proposed Price, Base Price, Difference(Base price - UNFI Cost calculated proposed price), and Description]  

`npm run lowerCostsInventoryPricebookComparison`


