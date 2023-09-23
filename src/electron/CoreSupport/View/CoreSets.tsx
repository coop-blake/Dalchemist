import { useEffect, useState } from "react";

import CoreSetsTable from "./CoreSetsTable";

import {
  selectAvailableItems,
  selectOurItems,
} from "../../CoreSupport/View/CoreSetSlice";
import { useAppSelector } from "../../View/hooks";

import { selectWorksheets } from "../../PriceChangeWorksheets/View/PriceChangeWorksheetsSlice";

import fileIcon from "./resources/images/file.svg";
import slashIcon from "./resources/images/slash.svg";

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
  }, [availableItems]);

  return (
    <div className="CoreSetsMainDiv">
      <span
        className="navButton"
        onClick={() => {
          setSubView(SubView.settings);
        }}
      >
        Setup
      </span>
      <span
        className="navButton"
        onClick={() => {
          setSubView(SubView.review);
        }}
      >
        Review
      </span>
      <span
        className="navButton"
        onClick={() => {
          setSubView(SubView.report);
        }}
      >
        Report
      </span>

      {subView === SubView.settings
        ? setupView()
        : subView === SubView.review
        ? reviewView()
        : subView === SubView.report
        ? reportView()
        : ""}
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
          <div>
            ✅ Loaded with {availableItems.length} items from our distributors
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
        <h2>Our Distributors</h2>
        <div style={{ paddingLeft: "10px" }}>
          {ourDistributors.map((distributor) => (
            <li>{distributor}</li>
          ))}
        </div>

        <hr></hr>

        <h2>Price Change Worksheets</h2>
        <div>{priceChangeWorksheetStatus}</div>
        <div>{priceChangeWorksheetFolderPath}</div>
        <div
          className="interfaceButton"
          onClick={selectPriceChangeWorksheetsFolderMenuButtonClicked}
        >
          Select Folder
        </div>
        <div style={{ paddingLeft: "10px" }}>
          {priceChangeWorksheets.map((worksheet) => (
            <li>{worksheet}</li>
          ))}
        </div>
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

function selectPriceChangeWorksheetsFolderMenuButtonClicked() {
  window.electron.ipcRenderer.sendMessage(
    "coreSetsWindowMessage",
    "selectPriceChangeWorksheetsFolder"
  );
}
