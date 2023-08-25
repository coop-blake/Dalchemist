# Outputs

## Generating
These commands are ment to be issued from the  📁[project root](../) which contains the [package.json](../package.json) file containing the commands outlined below.

When executed these commands will generate files in the [📁Data/Outputs](../Data/Outputs/) folder

### All Outputs
To Generate All Outputs:  

`npm run outputAll`

## Price Change Worksheets Vs Inventory Comparison
Imports any Price Change Worksheets that have been exported from Catapult with *tab seperation* and placed in the [📁Data/Inputs/Price Change Worksheets](../Data/Inputs/Price%20Change%20Worksheets/) directory. 

It uses these Price Change Worksheets and the Inventory text file to generate a list of Sale Items with inconsistent pricing. There are two lists that can be generated.


A list with higher sale than base prices and items on different sales worksheet with inconsitent pricing issue:  

`npm run checkPriceChangeWorksheetsAndInventory`

To include all items on multiple worksheets and items with same base price vs sale price

`npm run checkPriceChangeWorksheetsAndInventory-AllOuput`

## UNFI Price Book Vs Inventory Comparison
Needs the UNFI Pricebook and Inventory Files in the [📁Data/Inputs/](../Data/Inputs/) directory for success.

To generate a comma seperated list of all items in the pricebook and inventory file:  
`npm run inventoryItemsInPricebook`

For a tab seperated value file with 

| Scan Code | Last Cost | UNFI Cost | Ideal Margin | Proposed Price | Base Price | Difference (Base price - UNFI Cost calculated proposed price) | Description |
|-----------|-----------|-----------|--------------|----------------|------------|---------------------------------------------------------------|-------------|
|           |           |           |              |                |            |                                                               |             |

`npm run lowerCostsInventoryPricebookComparison`
