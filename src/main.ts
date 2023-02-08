// todo: Start a server
// connect post requests to generators outputs
import packageInfo from "../package.json" assert { type: "json" };
console.log(
  `Dalchemist Version 0.0.1
    Input files go in Data/Inputs

    To generate output files use: 
    npm run outputAll 

    Web Server Starting    `
);

import express from "express";

import PriceChangeWorksheetInventoryComparisons from "./Processors/PriceChangeWorksheetInventoryComparisons";

const dalchemist = express();

dalchemist.get("/", (request, result) => {
  result.send(`Dalchemist Version ${packageInfo.version}`);
});

dalchemist.get(
  "/process/priceChangeWorksheetInventoryComparisons",
  async (request, result) => {
    const priceChangeWorksheetInventoryComparisons =
      new PriceChangeWorksheetInventoryComparisons();
    await priceChangeWorksheetInventoryComparisons.initialize();
    result.send(
      `<pre>${priceChangeWorksheetInventoryComparisons.getOutput()}</pre>`
    );
  }
);

dalchemist.listen(4848, () => {
  console.log("Web Server Ready");
});
