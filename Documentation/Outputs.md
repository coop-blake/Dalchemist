# Outputs

### Generating
These commands are ment to be issued from the  [**Dalchemist**](../) 📁 which contains a [**package.json**](../package.json) file containing the commands outlined below.

When executed, these commands will generate files in [**Data/Outputs**](../Data/Outputs/) 📁

See the [**README.md**](../Data/README.md) in the [**Data/**](../Data/) 📁 and add the files needed for the commands you want to run. All commands require and Inventory.

### All Outputs
To Generate All Outputs:  

`npm run outputAll`

## Price Change Worksheets Vs Inventory Comparison
Imports any Price Change Worksheets that have been exported from Catapult with *tab seperation* and placed in the [📁Data/Inputs/Price Change Worksheets](../Data/Inputs/Price%20Change%20Worksheets/) directory. 

It uses these Price Change Worksheets and the Inventory to generate a list of Sale Items with inconsistent pricing. There are two lists that can be generated.


### Problems List
A list with higher sale than base prices and items on different sales worksheet with inconsitent pricing issue:  

`npm run checkPriceChangeWorksheetsAndInventory`

### Unexpected List

To include all items on multiple worksheets and items with same base price vs sale price

`npm run checkPriceChangeWorksheetsAndInventory-AllOuput`

## UNFI Price Book Vs Inventory Comparison
Needs the UNFI Pricebook and Inventory Files in the  [**Inputs**](../Data/Inputs/) 📁 located in the [**Data**](../Data/) 📁 for success.

### All UNFI vendedable Inventory Items

To generate a comma seperated list of all items in the UNFI pricebook and inventory files:

`npm run inventoryItemsInPricebook`



### Lower Costs Report

`npm run lowerCostsInventoryPricebookComparison`

For a tab seperated value file with 



| Scan Code | Last Cost | UNFI Cost | Ideal Margin | Proposed Price | Base Price | Difference (Base price - UNFI Cost calculated proposed price) | Description |
|-----------|-----------|-----------|--------------|----------------|------------|---------------------------------------------------------------|-------------|
|           |           |           |              |                |            |                                                               |             |


