import { useEffect} from "react";
import {Routes, Route, Link} from "react-router-dom"

import CoreSetsTable from "./CoreSetsTable";
import { selectAvailableItems } from "../../CoreSupport/View/CoreSetSlice";
import { useAppSelector } from "../../View/hooks";

export default function CoreSetsView() {

  const status = useAppSelector((state) => state.CoreSets.status);
  const filePath = useAppSelector((state) => state.CoreSets.filePath);
  const availableItems = useAppSelector(selectAvailableItems);

  useEffect(() => {
    window.electron.ipcRenderer.sendMessage("coreSetsWindowMessage", "loaded");
  }, [availableItems]);

  return (
    <div>
      <div>Core Supports yeash</div>
      <span>{status}</span>
      <div id="coreSetInfo">
        <span id="coreSetsHeader">Core Sets: </span>
        <span id="statusInfo">Loaded</span>
        <span
          id="selectFileMenuButton"
          onClick={selectFileMenuButtonClicked}
          style={{ paddingTop: "100px" }}
        >
          Select File
        </span>
        <span id="fileName">
          {filePath ?? "No Core Sets Excel File Location Saved"}
        </span>
      </div>
    
<Routes>
  <Route path="/CoreSets/Main">
  
  </Route>
  <Route path="/CoreSets/Report">Report</Route>
</Routes>
<CoreSetsTable
        key={availableItems}
        availableItems={availableItems}
        availableItemsLength={availableItems.length}
      />
      <span id="numberOfCoreSupportItems">{availableItems.length}</span>
      <span id="numberOfCoreSupportItemsFromOurDistributors"></span>
      <span id="saveCoreSetReportButton" style={{ paddingTop: "100px" }}>
        Save Report
      </span>
    </div>
  );
}

function selectFileMenuButtonClicked() {
  window.electron.ipcRenderer.sendMessage(
    "coreSetsWindowMessage",
    "selectFileMenuButtonClicked"
  );
}
