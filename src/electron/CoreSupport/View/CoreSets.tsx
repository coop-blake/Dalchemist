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
  selectSelectedDistributors,
  selectAllEntries,
} from "./CoreSetSlice";
import { listenToIPCAndSetState } from "./ipc";

import "../../Resources/css/coreSets.css";

enum SubView {
  settings,
  review,
  report,
}

export default function CoreSetsView() {
  const status = useAppSelector((state) => state.CoreSets.status);
  const filePath = useAppSelector((state) => state.CoreSets.filePath);
  const allEntries = useAppSelector(selectAllEntries);
  const selectedDistributorEntries = useAppSelector(
    selectSelectedDistributorEntries
  );
  const reportEntries = useAppSelector(selectReportEntries);
  const selectedDistributors = useAppSelector(selectSelectedDistributors);

  const [subView, setSubView] = useState(SubView.settings);

  useEffect(() => {
    window.electron.ipcRenderer.sendMessage("coreSetsWindowMessage", "loaded");
  }, [selectedDistributorEntries, subView]);

  useEffect(() => {
    listenToIPCAndSetState();
  }, []);

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
        {selectedDistributorEntries.length > 0 && (
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
        )}
        {reportEntries.length > 1 && (
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
        )}
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
        <br />
        <span id="reviewTitle" style={{paddingTop: "50px"}}>
        {reportEntries.length}/{selectedDistributorEntries.length} Report
          Entries
        </span>
        <span
          id="saveCoreSetReportButton"
          className="interfaceButton"
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
            <img id="fileIcon" src={fileIcon} alt="File Icon Image" /> Core
            Support XLSX File
          </h2>

          <span id="fileName">
            {filePath !== "" ? (
              filePath
            ) : (
              <span className="errorMessage">
                <img id="slashIcon" src={slashIcon} alt="Slash Icon Image" /> No
                Core Support Price List Excel File Location Saved ❗
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
          <div id="loadedFileStatus">
            ✅ Loaded {allEntries.length} entries from Core Support Price List
            File
            <br />
          </div>
        ) : (
          <div className="loadingStatus pulsating"> {status}</div>
        )}
      </div>
    );
  }

  function setupView() {
    const entryUPC = reportEntries.map((entry) => {
      return entry.UPC;
    });

    return (
      <div id="coreSetSettings">
        {coreSetsSetup()} <hr />
        <h2 style={{ paddingLeft: "10px" }}>
          {" "}
          🚛 {selectedDistributorEntries.length} Distributor Entries
        </h2>
        {selectedDistributorEntries.length > 0 ? (
          ""
        ) : (
          <div className="loadingStatus pulsating"> {status}</div>
        )}
        <DistributorChooser />
        {selectedDistributorEntries.length > 0 ? (
          <div id="loadedFileStatus">
            <br />
            🏷️{" "}
            {
              new Set(
                reportEntries.map((entry) => {
                  return entry.UPC;
                })
              ).size
            }{" "}
            unique items from {reportEntries.length} entries matching Inventory
          </div>
        ) : (
          <div className="loadingStatus pulsating"> {status}</div>
        )}
        <hr></hr>
      </div>
    );
  }

  function reviewView() {
    return (
      <div className="core-support-table">
        <CoreSetsTable />

        <span id="reviewTitle">
          {selectedDistributorEntries.length} Distributor Entries
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
