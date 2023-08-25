/**
 * An interactive Web Service that displays status of the Data files in the Input folder.
 * @module Status
 * @category Interactive Web Service
 * @internal
 * @example
 * npm run startStatusCheck
 */
// todo: Start a server
// connect post requests to generators outputs
import packageInfo from "../package.json" assert { type: "json" };

import express from "express";

import DuplicateEntriesChecker from "./Generators/DuplicateEntriesChecker";
import CoreSupportChecker from "./Generators/CoreSupportChecker";

async function start() {
  const dalchemist = express();

  await DuplicateEntriesChecker.start();
  await CoreSupportChecker.start();

  dalchemist.get("/", (request, result) => {
    result.send(`

<html>
<head>
<link rel="stylesheet" type="text/css" rel="noopener" target="_blank" href="index.css">
</head>
<body>

<h2>Dalchemist Version ${packageInfo.version}</h2>
<div class="moduleDiv">
<h2>Duplicate Checker</h2>
<div class="moduleDescription">
<b>Required Data Files:</b>
<ul>
<li>📝CheckForDups.txt</li>
</ul>
<b>Transmutations:</b>
<ul>
<li>Looks in the root of the 📁Data/📁Input Folder</li>
<li>Expects to find a Tab seperated file</li>
<li>With or without a header</li>
<li>Expects Unique data in the first column</li>
<li>Outputs duplicates along with the data in the second coloumn</li>
</ul>
</div>
<div class="moduleStatus">
<b>Status:</b></br>

Loaded 📝CheckForDups.txt from the 📁Data/📁Input Folder<br/>
</br>
<b>Outputs:</b></br>

<a href="/DuplicateChecker/duplicates">🎫 ${DuplicateEntriesChecker.getNumberOfDuplicates()}  Duplicated Entries Printout</a> <br/>
<a href="/DuplicateChecker/duplicatesTSV.txt">🎀 ${DuplicateEntriesChecker.getNumberOfDuplicates()}  Duplicated Entries TSV</a> 

</div>

</div>


<div class="moduleDiv">
<h2>Core Support Checker</h2>
<div class="moduleDescription">

<b>Required Data Files:</b>
<ul>
<li>🧮 Core_Sets_Cost_Support_Price_List.xlsx</li>
<li>📝 Inventory.txt</li>
</ul>
<b>Transmutations:</b>
<ul>
<li>Filters Items for our distributors  (${CoreSupportChecker.getOurDistributors().join(
      " | "
    )})</li>
<li>Filters Items from our distributors that are also in Inventory.txt 
      <ul>
        <li> If item scan code is not found, item is searched by UNFI supplier ID.</li> 
        <li> UNFI must be the default supplier of item in our Inventory to be found by Supplier ID</li>
      </ul>
<li>Creates a list of Items available from multiple distributors</li>
</ul>
</div>
<div class="moduleStatus">
<b>Status:</b></br>
File Creation Date: 📅 ${CoreSupportChecker.getFileCreationDate()} </br>
</br>
<b>Outputs:</b></br>
  <a href="/CoreSupport/CoreDistributorEntries.txt">🎪 Filtered Items from our Distributors: ${CoreSupportChecker.getNumberOfEntries()}</a><br/>
  <a href="/CoreSupport/CoreEntries">🎪 Filtered items from our Distributors with entries in Catapult: ${CoreSupportChecker.getNumberOfOurItems()}</a><br/>
  <a href="/CoreSupport/CoreInvalidEntries">🔕 Filtered Distributor Items from Multiple Distributors:</a> ${CoreSupportChecker.getNumberOfMultipleAvailableDistributorItems()}<br/>
  <a href="/CoreSupport/CoreInvalidLines">🔕 Unexpected Lines:</a> ${CoreSupportChecker.getNumberOfInvalidLines()}<br/>
</div>
</div>
</body>

`);
  });

  //Duplicate Checker Links
  dalchemist.get("/DuplicateChecker/duplicates", async (request, result) => {
    result.send(DuplicateEntriesChecker.getOutput());
  });
  dalchemist.get(
    "/DuplicateChecker/duplicatesTSV.txt",
    async (request, result) => {
      result.setHeader("content-type", "text/plain");
      result.send(`${DuplicateEntriesChecker.getTSVOutput()}`);
    }
  );

  //Core Support Checker Links

  dalchemist.get(
    "/CoreSupport/CoreDistributorEntries.txt",
    async (request, result) => {
      result.setHeader("content-type", "text/plain");

      result.send(`${CoreSupportChecker.getCoreDistributorEntriesOutput()}`);
    }
  );

  dalchemist.use(express.static("./src/Resources"));

  dalchemist.listen(4848, () => {
    console.log("Web Server Ready");
  });
}

console.log(` Status Check Web Server Starting    `);

start().then();
