import { Google } from "../google";
import * as express from "express";
import * as path from "path";
import * as fs from 'fs';


import Main from '../../electron/electron-main'

import Settings from '../../electron/Settings';


import InventoryImporter, {
  InventoryEntry,
} from "../../TextImporters/Inventory";
import {
  getIndex,
  getNewItemsReport,
  getItemsAlreadyInInventoryReport,
  getPriceUpdatesInfo,
  getAddDropPriceUpdatesTSV
} from "./htmlOutputs";

//Main.main(app, BrowserWindow);

/*###################################################################################
# Start Function
#####################################################################################*/
export async function start( onStarted : Function) {


  console.log("starting");
  Main.statusMessageUpdate("Starting")
  const settings = Settings.getInstance()

  Main.statusMessageUpdate("Getting Google Certificate")

  let googleCertPath = await settings.loadJsonLocation() as string;
  if (googleCertPath) {
    console.log("googleCertPath", googleCertPath);
  } else {
    console.log("No googleCertPath!");
  }

  /*###################################################################################
# Read Inventory
#####################################################################################*/
Main.statusMessageUpdate("Reading Inventory")

  const northInventoryFilePath = path.join(
    __dirname,
    "../Inventory/fetches/North.txt"
  );
  
  if (!fs.existsSync(northInventoryFilePath)) {
    throw(Error("Inventory File does not exist!"))
    return
  }
  console.log("Reading North Inventory -Preparing Data");
  const NorthInventoryImport = new InventoryImporter();
  NorthInventoryImport.textFilePath = northInventoryFilePath;
  await NorthInventoryImport.start();
  /*###################################################################################
# Read Add/Drop
#####################################################################################*/
  console.log("Logging into Google");
  Main.statusMessageUpdate("Logging Into Google")

  //config Google
  const googleCertFilename = "../Inventory/CertAndLogs/googleCert.json";
  const googleCertFilePath = path.join(__dirname, googleCertFilename);

  if (!fs.existsSync(googleCertPath)) {
    throw(Error("Google Service Account Certificate does not exist!"))
  }

  const sheets = Google.getSheetsFor(googleCertPath);
  const spreadsheetId = "1RprheRwf1bysnNYk9jGg1zPiA4DoiGMMe74j9nVP_hU"; //document id of "Copy of add drop for API Dev"

  /*###################################################################################
# Process New Items
#####################################################################################*/
  //If new item is in inventory - put the entries in an array together
  console.log("Reading New Items");
  Main.statusMessageUpdate("Reading New Items")

  //Read data from New Items Tab
  const newItemsResponse = await sheets.spreadsheets.values.get({
    spreadsheetId: spreadsheetId,
    range: `New Items!A3:Y300`, // Adjust range as needed
  });

  const newItems = newItemsResponse.data.values
    ?.map((newItemData) => newItemEntryFromValueArray(newItemData))
    .filter((newItemData) => {
      return newItemData !== null;
    }) as [NewItemEntry];

  const itemsAlreadyInInventory = newItems
    ?.map((newItem) => {
      const inventoryItem = NorthInventoryImport.getEntryFromScanCode(
        newItem?.ScanCode ? newItem?.ScanCode : ""
      );
      return inventoryItem === undefined ? null : [newItem, inventoryItem];
    })
    .filter((newItemData) => {
      return newItemData;
    }) as [[NewItemEntry, InventoryEntry]];
  /*###################################################################################
# Process Attribute Updates
#####################################################################################*/
  // Read data from "Price and attribute changes" tab
  Main.statusMessageUpdate("Reading Price and Attribute Changes")

  const attributeChangesResponse = await sheets.spreadsheets.values.get({
    spreadsheetId: spreadsheetId,
    range: `Price & Attribute Changes!A3:AC300`, // Adjust range as needed
  });
  const attributeChangeItems = attributeChangesResponse.data.values
    ?.map((attributeChangeItem) =>
      attributeChangeEntryFromValueArray(
        fillArrayWithEmptyStrings(29, attributeChangeItem)
      )
    )
    .filter((attributeChangeItem) => {
      return attributeChangeItem;
    }) as [AttributeChangeEntry]
  //If attributeChange contains a price update - put it in an array
  const priceUpdates = attributeChangeItems?.filter((attributeChange) => {
    return (
      containsAny(attributeChange?.ChangeOne ?? "", [
        "Price & Cost Change",
        "Price Change Only",
        "Cost Change Only",
      ]) ||
      containsAny(attributeChange?.ChangeTwo ?? "", [
        "Price & Cost Change",
        "Price Change Only",
        "Cost Change Only",
      ]) ||
      containsAny(attributeChange?.ChangeThree ?? "", [
        "Price & Cost Change",
        "Price Change Only",
        "Cost Change Only",
      ]) ||
      containsAny(attributeChange?.ChangeFour ?? "", [
        "Price & Cost Change",
        "Price Change Only",
        "Cost Change Only",
      ])
    );
  }) as [AttributeChangeEntry];
  /*###################################################################################
# Start Webserver
#####################################################################################*/

  console.log("Preparing Server");
  Main.statusMessageUpdate("Creating Webserver")

  const dalchemist = express();

  dalchemist.get("/", (request, response) => {
    response.send(getIndex(newItems,itemsAlreadyInInventory, attributeChangeItems, priceUpdates ));
  });

  dalchemist.get("/newItems", async (request, response) => {
    response.send(getNewItemsReport(newItems));
  });

  dalchemist.get("/itemsAlreadyInInventory", async (request, response) => {
    response.send(getItemsAlreadyInInventoryReport(itemsAlreadyInInventory));
  });
  dalchemist.get("/priceUpdateInfo", async (request, response) => {
    response.send(getPriceUpdatesInfo(priceUpdates, NorthInventoryImport));
  });
  dalchemist.get("/addDropPriceChanges.txt", async (request, response) => {
    response.setHeader('Content-Disposition', 'attachment; filename="addDropPriceChanges.txt"');
    response.setHeader('Content-Type', 'text/tab-separated-values');
    
    response.send(getAddDropPriceUpdatesTSV(priceUpdates));
  });

  getAddDropPriceUpdatesTSV
  dalchemist.listen(4848, () => {
    onStarted()
  });

  /*###################################################################################
# End Start Function
#####################################################################################*/
}

/*###################################################################################
# Item Types and Return Functions
#####################################################################################*/

const newItemEntryFromValueArray = function (
  valueArray: Array<string>
): NewItemEntry | null {
  //Based off of expected Values as outlined in
  // Data/Inputs/README.md
  if (valueArray.length === 25) {
    const entry: NewItemEntry = {
      Date: valueArray[0].trim(),
      Client: valueArray[1].trim(),
      ScanCode: valueArray[2].trim(),
      Supplier: valueArray[3].trim(),
      SupplierItemID: valueArray[4].trim(),
      Brand: valueArray[5].trim(),
      Name: valueArray[6].trim(),
      Unit: valueArray[7].trim(),
      SubDepartment: valueArray[8].trim(),
      Quantity: valueArray[9].trim(),
      CaseCost: valueArray[10].trim(),
      UnitCost: valueArray[11].trim(),
      MARGIN: valueArray[12].trim(),
      ShippingPercent: valueArray[13].trim(),
      ProposedPrice: valueArray[14].trim(),
      BasePrice: valueArray[15].trim(),
      Department: valueArray[16].trim(),
      BottleDepositFlag: valueArray[17].trim(),
      LocalDirectFlag: valueArray[18].trim(),
      LocalSixFlag: valueArray[19].trim(),
      LocalORFlag: valueArray[20].trim(),
      OGFlag: valueArray[21].trim(),
      FlipChartAddFlag: valueArray[22].trim(),
      Comments: valueArray[23].trim(),

      //All values as array as received
      valuesArray: valueArray,
    };
    return entry;
  }

  return null;
};

const attributeChangeEntryFromValueArray = function (
  valueArray: Array<string>
): AttributeChangeEntry | null {
  //Based off of expected Values as outlined in
  // Data/Inputs/README.md
  if (valueArray.length === 29) {
    const entry: AttributeChangeEntry = {
      Date: valueArray[0].trim(),
      Client: valueArray[1].trim(),
      ScanCode: valueArray[2].trim(),
      Supplier: valueArray[3].trim(),
      SupplierItemID: valueArray[4].trim(),
      Brand: valueArray[5].trim(),
      Name: valueArray[6].trim(),
      Unit: valueArray[7].trim(),
      SubDepartment: valueArray[8].trim(),
      Quantity: valueArray[9].trim(),
      CaseCost: valueArray[10].trim(),
      UnitCost: valueArray[11].trim(),
      MARGIN: valueArray[12].trim(),
      ShippingPercent: valueArray[13].trim(),
      ProposedPrice: valueArray[14].trim(),
      BasePrice: valueArray[15].trim(),
      Department: valueArray[16].trim(),
      BottleDepositFlag: valueArray[17].trim(),
      LocalDirectFlag: valueArray[18].trim(),
      LocalSixFlag: valueArray[19].trim(),
      LocalORFlag: valueArray[20].trim(),
      OGFlag: valueArray[21].trim(),
      ChangeOne: valueArray[22].trim(),
      ChangeTwo: valueArray[23].trim(),
      ChangeThree: valueArray[24].trim(),
      ChangeFour: valueArray[25].trim(),
      Comments: valueArray[26].trim(),
      BestDateForPriceChange: valueArray[27].trim(),
      BestTimeForPriceChange: valueArray[28].trim(),

      valuesArray: valueArray,
    };
    return entry;
  }

  return null;
};

export type AttributeChangeEntry = {
  Date: string;
  Client: string;
  ScanCode: string;
  Supplier: string;
  SupplierItemID: string;
  Brand: string;
  Name: string;
  Unit: string;
  SubDepartment: string;
  Quantity: string;
  CaseCost: string;
  UnitCost: string;
  MARGIN: string;
  ShippingPercent: string;
  ProposedPrice: string;
  BasePrice: string;
  Department: string;
  BottleDepositFlag: string;
  LocalDirectFlag: string;
  LocalSixFlag: string;
  LocalORFlag: string;
  OGFlag: string;
  ChangeOne: string;
  ChangeTwo: string;
  ChangeThree: string;
  ChangeFour: string;
  Comments: string;
  BestDateForPriceChange: string;
  BestTimeForPriceChange: string;
  valuesArray: Array<string>;
};

export type NewItemEntry = {
  Date: string;
  Client: string;
  ScanCode: string;
  Supplier: string;
  SupplierItemID: string;
  Brand: string;
  Name: string;
  Unit: string;
  SubDepartment: string;
  Quantity: string;
  CaseCost: string;
  UnitCost: string;
  MARGIN: string;
  ShippingPercent: string;
  ProposedPrice: string;
  BasePrice: string;
  Department: string;
  BottleDepositFlag: string;
  LocalDirectFlag: string;
  LocalSixFlag: string;
  LocalORFlag: string;
  OGFlag: string;
  FlipChartAddFlag: string;
  Comments: string;
  valuesArray: Array<string>;
};

/*###################################################################################
# Utility Functions
#####################################################################################*/

function fillArrayWithEmptyStrings(num: number, arr: string[]): string[] {
  if (arr.length >= num) {
    return arr;
  }

  const diff = num - arr.length;
  const emptyStrings = new Array(diff).fill("");

  return [...arr, ...emptyStrings];
}

function containsAny(str: string, substrArray: string[]): boolean {
  return substrArray.some((substring) => str.includes(substring));
}
