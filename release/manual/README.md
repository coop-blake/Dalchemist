# Dalchemist

Version 0.0.2

The main window and taskbar menu provides access to 3 modules: Inventory, Add-Drop, and Core Support.

## Inventory

The Inventory values are pulled from a Google sheet and should match our Catapult inventory; half an hour after last replication.

Inventory items can be filtered and sorted by any value in the table. The string filter is case insensitive and will match values containing the input anywhere in their value.

## Add Drop

The Add Drop interface is updated with values from the Google sheet every 100 seconds. The interface has three tables; _New Items_, _Attribute Changes_, and _Price Updates_ that allow you to review the current add/drop items.

If any New Item entries match our inventory then they will show up on an Invalid Items tab where the values can be compared.

The Price Change tab has a button "Save TSV" that provides a prompt to sale the Price/Cost changes as a tab seperated file that can be imported directly into catapult. There is also a taskbar menu option to do this without opening the window.

## Core Support

The Core Support Module
