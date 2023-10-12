import React, { useEffect, useState } from "react";

import CoreSetsTable from "./CoreSetsTable";
import {ipcRenderer} from "electron";
import {
  selectAvailableItems,
  selectOurItems,
} from "../../CoreSupport/View/CoreSetSlice";
import { useAppSelector } from "../../View/hooks";

import { selectWorksheets } from "../../PriceChangeWorksheets/View/PriceChangeWorksheetsSlice";

import fileIcon from "./resources/images/file.svg";
import slashIcon from "./resources/images/slash.svg";
import toolIcon from "./resources/images/settings.svg";
import saveIcon from "./resources/images/save.svg";
import thumbsUpIcon from "./resources/images/thumbs-up.svg";


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

export default function CoreSetsView() {
  const status = useAppSelector((state) => state.CoreSets.status);
  const filePath = useAppSelector((state) => state.CoreSets.filePath);
  const availableItems = useAppSelector(selectAvailableItems);
  const ourItems = useAppSelector(selectOurItems);

  const priceChangeWorksheetStatus = useAppSelector(
    (state) => state.PriceChangeWorksheets.status
  );

  const priceChangeWorksheetFolderPath = useAppSelector(
    (state) => state.PriceChangeWorksheets.folderPath
  );

  const priceChangeWorksheets = useAppSelector(selectWorksheets);

  const [subView, setSubView] = useState(SubView.settings);

  useEffect(() => {
    window.electron.ipcRenderer.sendMessage("coreSetsWindowMessage", "loaded");
  }, [availableItems, subView]);

  return (
    <div className="CoreSetsMainDiv">
      <div className="navMenu">
        <span
          className={`navButton ${subView === SubView.settings && "activeButton"}`}
          onClick={() => {
            setSubView(SubView.settings);
          }}
        >
          <img id="toolIcon" src={toolIcon} alt="Tool Icon Image" /> Setup
        </span>
        <span
          className={`navButton ${subView === SubView.review && "activeButton"}`}
          onClick={() => {
            setSubView(SubView.review);
          }}
        >
          <img id="thumbsUpIcon" src={thumbsUpIcon} alt="Thumbs Up Icon Image" />  Review
        </span>
        <span
          className={`navButton ${subView === SubView.report && "activeButton"}`}
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
        <span id="numberOfCoreSupportItems">{availableItems.length}</span>
        <span id="numberOfCoreSupportItemsFromOurDistributors">
          {ourItems.length}
        </span>
        <span
          id="saveCoreSetReportButton"
          style={{ paddingTop: "100px" }}
          onClick={saveCoreSetReportButtonClicked}
        >
          Save Report
        </span>
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
        {availableItems.length > 0 ? (
          <div id="loadedFileStatus">
            ✅ Loaded File
          </div>
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
            <li>{distributor}</li>
          ))}
        </div>
        {availableItems.length > 0 ? (
          <div id="loadedFileStatus">
            ✅ Loaded with {availableItems.length} items from our distributors
          </div>
        ) : (
          <div className="loadingStatus pulsating"> {status}</div>
        )}
        <hr></hr>

        <h2 style={{ paddingLeft: "10px" }}>Price Change Worksheets</h2>
        <div>{priceChangeWorksheetStatus}</div>
        <div>{priceChangeWorksheetFolderPath}</div>
        <div
          className="interfaceButton"
          onClick={selectPriceChangeWorksheetsFolderMenuButtonClicked}
        >
          Select Folder
        </div>
        <ul style={{ paddingLeft: "10px" }}>
          {priceChangeWorksheets.map((worksheet) => (
            <li style={{ marginLeft: "40px" }}>{worksheet}</li>
          ))}
        </ul>
      </div>
    );
  }

  function reviewView() {
    return (
      <div>
        <CoreSetsTable />
        <span id="numberOfCoreSupportItems">{availableItems.length}</span>
        <span id="numberOfCoreSupportItemsFromOurDistributors">
          {ourItems.length}
        </span>
      </div>
    );
  }
}

//Messages to Main Process
function selectFileMenuButtonClicked() {
  ipcRenderer.send(
    "coreSetsWindowMessage",
    "selectFileMenuButtonClicked"
  );
}
function saveCoreSetReportButtonClicked() {
  ipcRenderer.send(
    "coreSetsWindowMessage",
    "saveCoreSetReportButtonClicked"
  );
}

function openCoreSetsFileButtonClicked() {
  ipcRenderer.send(
    "coreSetsWindowMessage",
    "openCoreSetsFile"
  );
}

function selectPriceChangeWorksheetsFolderMenuButtonClicked() {
  ipcRenderer.send(
    "coreSetsWindowMessage",
    "selectPriceChangeWorksheetsFolder"
  );
}
