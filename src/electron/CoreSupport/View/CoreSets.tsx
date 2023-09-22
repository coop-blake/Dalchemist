import { useEffect, useState } from "react";

import CoreSetsTable from "./CoreSetsTable";
import { selectAvailableItems } from "../../CoreSupport/View/CoreSetSlice";
import { useAppSelector } from "../../View/hooks";

import "../../Resources/css/coreSets.css";

enum SubView {
  settings,
  review,
  report,
}
export default function CoreSetsView() {
  const status = useAppSelector((state) => state.CoreSets.status);
  const filePath = useAppSelector((state) => state.CoreSets.filePath);
  const availableItems = useAppSelector(selectAvailableItems);

  const [subView, setSubView] = useState(SubView.settings);

  useEffect(() => {
    window.electron.ipcRenderer.sendMessage("coreSetsWindowMessage", "loaded");
  }, [availableItems]);

  return (
    <div>
      <span>{status}</span>
      <span
        className="navButton"
        onClick={() => {
          setSubView(SubView.settings);
        }}
      >
        Settings
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
        ? settingsView()
        : subView === SubView.review
        ? reviewView()
        : subView === SubView.report
        ? "Report"
        : ""}
    </div>
  );
  function settingsView() {
    return (
      <div>
        {" "}
        <div id="coreSetInfo">
          <span id="coreSetsHeader" onClick={openCoreSetsFileButtonClicked}>
            Core Sets:{" "}
          </span>
          <span id="statusInfo">Loaded</span>
          <span id="selectFileMenuButton" onClick={selectFileMenuButtonClicked}>
            Select File
          </span>
          <span id="fileName">
            {filePath ?? "No Core Sets Excel File Location Saved"}
          </span>
          <div>Price Change Worksheets</div>
          <div>Our Suppliers</div>
        </div>
      </div>
    );
  }

  function reviewView() {
    return (
      <div>
        <CoreSetsTable
          key={availableItems}
          availableItems={availableItems}
          availableItemsLength={availableItems.length}
        />
        <span id="numberOfCoreSupportItems">{availableItems.length}</span>
        <span id="numberOfCoreSupportItemsFromOurDistributors"></span>
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
  alert("ok");
  window.electron.ipcRenderer.sendMessage(
    "coreSetsWindowMessage",
    "openCoreSetsFile"
  );
}
