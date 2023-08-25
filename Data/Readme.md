# Data

## Inputs:

This folder contains the files that Dalchamist loads into the modules on startup.

### Inventory

Tab Seperated Text file of all Inventory items. See the Inventory module documentation for expected header, field type, and column order.

[Inventory.txt](Inputs/Inventory.txt)

### UNFI Pricebook

Obtained from UNFI through their reporting system. The expected file name is `pb000000.txt` The zeros represent your UNFI account number.

### UNFI Price Change

Obtained from UNFI through their reporting system. The expected file name is `pc000000.txt` The zeros represent your UNFI account number.

### NCG Core Sets Cost Support Price List

Obtained from NCG through their resources website. The expected file name is
`Core_Sets_Cost_Support_Price_List.xlsx`

### Catapult Price Change Worksheets

Catapult worksheets exported as Tab seperated text files can be placed in [Price Change Worksheets 📁](Inputs/Price%20Change%20Worksheets/)

## Outputs:

Contains the outputs of the module Generators.

[checkPriceChangeWorksheetsAndInventory.txt](Outputs/checkPriceChangeWorksheetsAndInventory.txt)  
[checkPriceChangeWorksheetsAndInventoryAllOutput.txt](Outputs/checkPriceChangeWorksheetsAndInventoryAllOutput.txt)  
[inventoryItemsInPricebook.txt](Outputs/inventoryItemsInPricebook.txt)  
[lowerCostsInventoryPricebookComparison.txt](Outputs/lowerCostsInventoryPricebookComparison.txt)

## Sample Data File Tree:

The following sample data tree has UNFI files from two accounts and a small handfull of Catapult Price Change Worksheets.

📁 Data:

- Readme.md
- 📁 Inputs

  - Core_Sets_Cost_Support_Price_List.xlsx
  - Inventory.txt
  - pb003116.txt
  - pb003116.xls
  - pb018620.xls
  - pc003116.xls
  - pc018620.xls
  - README.md
  - 📁 Price Change Worksheets
    - Basics Country Life 2023 V2.txt
    - Basics Deli 2023 v4.txt
    - Basics Grocery 2023 V17.txt
    - Basics Wellness 2023 V5.txt
    - JULY A V3.txt
    - JULY AB.txt

- 📁 Outputs
  - checkPriceChangeWorksheetsAndInventory.txt
  - checkPriceChangeWorksheetsAndInventoryAllOutput.txt
  - inventoryItemsInPricebook.txt
  - lowerCostsInventoryPricebookComparison.txt
