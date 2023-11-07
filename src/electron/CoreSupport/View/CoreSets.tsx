import React, { useEffect, useState } from "react";

import CoreSetsTable from "./CoreSetsTable";
import CoreSetReportTable from "./ReportTable";
//import { ipcRenderer } from "electron";
import "./resources/css/core-support-table.css";
import { useAppSelector } from "../../View/hooks";
import { DistributorChooser } from "./DistributorChooser";
import {
  CoreSetsStatus,
  CoreSupportPriceListEntry,
  CoreSupportReportEntry,
} from "../../CoreSupport/shared";

import fileIcon from "./resources/images/file.svg";
import slashIcon from "./resources/images/slash.svg";
import toolIcon from "./resources/images/settings.svg";
import saveIcon from "./resources/images/save.svg";
import thumbsUpIcon from "./resources/images/thumbs-up.svg";

import { store } from "../../View/store";
import {
  setStatus,
  setFilePath,
  setAllEntries,
  setSelectedDistributorEntries,
  setReportEntries,
  selectSelectedDistributorEntries,
  selectReportEntries,
  setAvailableDistributors,
  setSelectedDistributors,
} from "./CoreSetSlice";

import "../../Resources/css/coreSets.css";

enum SubView {
  settings,
  review,
  report,
}

const ourDistributors = [
  "Equal Exchange - Direct",
  "Tony's Fine Foods - Ridgefield, WA",
  "UNFI - Ridgefield, WA",
  "Ancient Nutrition - Direct",
];

window.electron.ipcRenderer.on(
  "CoreSetAllEntriesUpdated",
  (coreSetItemsArray: Array<CoreSupportPriceListEntry>) => {
    console.log("CoreSetAllEntriesUpdated", event, coreSetItemsArray);
    if (typeof coreSetItemsArray !== "undefined") {
      console.log(coreSetItemsArray);

      store.dispatch(setAllEntries(coreSetItemsArray));
    }
  }
);

window.electron.ipcRenderer.on(
  "CoreSetOurDistributorsEntriesUpdated",
  (coreSetItemsArray: Array<CoreSupportPriceListEntry>) => {
    console.log("CoreSetAllEntriesUpdated", event, coreSetItemsArray);
    if (typeof coreSetItemsArray !== "undefined") {
      console.log(coreSetItemsArray);

      store.dispatch(setSelectedDistributorEntries(coreSetItemsArray));
    }
  }
);

window.electron.ipcRenderer.on(
  "CoreSetStatusUpdated",
  (status: CoreSetsStatus) => {
    console.log("CoreSetStatusUpdated🔴🔴🔴🔴🔴", status);
    store.dispatch(setStatus(status));
  }
);
window.electron.ipcRenderer.on("CoreSetFilePathUpdated", (filePath: string) => {
  console.log("CoreSetStatusUpdated🔴🔴🔴🔴🔴", status);
  store.dispatch(setFilePath(filePath));
});

window.electron.ipcRenderer.on(
  "CoreSetReportEntries",
  (coreSetReportEntriesArray: Array<CoreSupportReportEntry>) => {
    console.log(
      "CoreSetReportEntriesUpdated🟢🟢🟢🟢🟢",
      coreSetReportEntriesArray
    );
    if (typeof coreSetReportEntriesArray !== "undefined") {
      console.log(coreSetReportEntriesArray);

      store.dispatch(setReportEntries(coreSetReportEntriesArray));
    }
  }
);
window.electron.ipcRenderer.on(
  "CoreSetAllDistributors",
  (availableDistributorsArray: Array<string>) => {
    console.log("availableDistributorsArray", availableDistributorsArray);
    if (typeof availableDistributorsArray !== "undefined") {
      console.log(availableDistributorsArray);

      store.dispatch(setAvailableDistributors(availableDistributorsArray));
    }
  }
);
window.electron.ipcRenderer.on(
  "CoreSetUserSelectedDistributors",
  (selectedDistributorsArray: Array<string>) => {
    console.log("CoreSetUserSelectedDistributors", selectedDistributorsArray);
    if (typeof selectedDistributorsArray !== "undefined") {
      console.log(selectedDistributorsArray);

      store.dispatch(setSelectedDistributors(selectedDistributorsArray));
    }
  }
);
export default function CoreSetsView() {
  const status = useAppSelector((state) => state.CoreSets.status);
  const filePath = useAppSelector((state) => state.CoreSets.filePath);
  const selectedDistributorEntries = useAppSelector(selectSelectedDistributorEntries);
  const reportEntries = useAppSelector(selectReportEntries);

  const [subView, setSubView] = useState(SubView.settings);

  useEffect(() => {
    window.electron.ipcRenderer.sendMessage("coreSetsWindowMessage", "loaded");
  }, [selectedDistributorEntries, subView]);

  return (
    <div className="CoreSetsMainDiv">
      <div className="navMenu">
        <span
          className={`navButton ${
            subView === SubView.settings && "activeButton"
          }`}
          onClick={() => {
            setSubView(SubView.settings);
          }}
        >
          <img id="toolIcon" src={toolIcon} alt="Tool Icon Image" /> Setup
        </span>
        <span
          className={`navButton ${
            subView === SubView.review && "activeButton"
          }`}
          onClick={() => {
            setSubView(SubView.review);
          }}
        >
          <img
            id="thumbsUpIcon"
            src={thumbsUpIcon}
            alt="Thumbs Up Icon Image"
          />{" "}
          Review
        </span>
        <span
          className={`navButton ${
            subView === SubView.report && "activeButton"
          }`}
          onClick={() => {
            setSubView(SubView.report);
          }}
        >
          <img id="saveIcon" src={saveIcon} alt="Save Icon Image" /> Report
        </span>
      </div>
      <div className="mainContent">
        {subView === SubView.settings
          ? setupView()
          : subView === SubView.review
          ? reviewView()
          : subView === SubView.report
          ? reportView()
          : ""}
      </div>
    </div>
  );

  function reportView() {
    return (
      <div>
        Report
        <br />
        <span id="numberOfCoreSupportItems"></span>
        <span id="numberOfCoreSupportItemsFromOurDistributors">
          {reportEntries.length}/{selectedDistributorEntries.length} Report Entries
        </span>
        <span
          id="saveCoreSetReportButton"
          style={{ paddingTop: "100px" }}
          onClick={saveCoreSetReportButtonClicked}
        >
          Save Report
        </span>
        <CoreSetReportTable />
      </div>
    );
  }

  function coreSetsSetup() {
    return (
      <div id="coreSetsSetup">
        <div>
          <h2>
            {" "}
            <img id="fileIcon" src={fileIcon} alt="File Icon Image" /> Core Sets
            Excel File
          </h2>

          <span id="fileName">
            {filePath !== "" ? (
              filePath
            ) : (
              <span className="errorMessage">
                <img id="slashIcon" src={slashIcon} alt="Slash Icon Image" /> No
                Core Sets Excel File Location Saved ❗
              </span>
            )}
          </span>
          <br />
          <div
            className="interfaceButton"
            onClick={selectFileMenuButtonClicked}
          >
            Select File
          </div>

          {filePath !== "" && (
            <div
              className="interfaceButton"
              onClick={openCoreSetsFileButtonClicked}
            >
              Open in Default Application
            </div>
          )}
        </div>
        {selectedDistributorEntries.length > 0 ? (
          <div id="loadedFileStatus">✅ Loaded File</div>
        ) : (
          <div className="loadingStatus pulsating"> {status}</div>
        )}
      </div>
    );
  }

  function setupView() {
    return (
      <div id="coreSetSettings">
        {coreSetsSetup()}
        <hr></hr>
        <h2 style={{ paddingLeft: "10px" }}>Our Distributors</h2>
        <div style={{ paddingLeft: "30px" }}>
          {ourDistributors.map((distributor) => (
            <li key={distributor}>{distributor}</li>
          ))}
        </div>
        {selectedDistributorEntries.length > 0 ? (
          <div id="loadedFileStatus">
            ✅ Loaded with {selectedDistributorEntries.length} entries from our distributors{" "}
            <br />✅ Loaded with {reportEntries.length} entries in our Inventory
          </div>
        ) : (
          <div className="loadingStatus pulsating"> {status}</div>
        )}
        <hr></hr>
        <DistributorChooser />
      </div>
    );
  }

  function reviewView() {
    return (
      <div className="core-support-table">
        <CoreSetsTable />
        <span id="numberOfCoreSupportItems">{selectedDistributorEntries.length}</span>
        <span id="numberOfCoreSupportItemsFromOurDistributors">
          {reportEntries.length}
        </span>
      </div>
    );
  }
}

//Messages to Main Process
function selectFileMenuButtonClicked() {
  window.electron.ipcRenderer.sendMessage(
    "coreSetsWindowMessage",
    "selectFileMenuButtonClicked"
  );
}
function saveCoreSetReportButtonClicked() {
  window.electron.ipcRenderer.sendMessage(
    "coreSetsWindowMessage",
    "saveCoreSetReportButtonClicked"
  );
}

function openCoreSetsFileButtonClicked() {
  window.electron.ipcRenderer.sendMessage(
    "coreSetsWindowMessage",
    "openCoreSetsFile"
  );
}
