import React, { useEffect, useRef, useState } from "react";

import { CoreSetsStatus, CoreSupportEntry } from "electron/CoreSupport/shared";

import CoreSetsTable from "./CoreSetsTable";

import { selectAvailableItems } from "../../CoreSupport/View/CoreSetSlice";

import {
  Column,
  Formatters,
  GridOption,
  SlickgridReact,
} from "slickgrid-react";

import { TabulatorFull as Tabulator } from "tabulator-tables";

import { useAppSelector } from "../../View/hooks";

export default function CoreSetsView() {
  const tableRef = useRef(null);
  //const data = useRef([] as Array<CoreSupportEntry>);

  let coreSetItems = [] as Array<CoreSupportEntry>;

  // const data = [
  //   { id: 1, name: "Oli Bob", age: "12", col: "red", dob: "" },
  //   { id: 2, name: "Mary May", age: "1", col: "blue", dob: "14/05/1982" },
  //   {
  //     id: 3,
  //     name: "Christine Lobowski",
  //     age: "42",
  //     col: "green",
  //     dob: "22/05/1982",
  //   },
  //   {
  //     id: 4,
  //     name: "Brendon Philips",
  //     age: "125",
  //     col: "orange",
  //     dob: "01/08/1980",
  //   },
  //   {
  //     id: 5,
  //     name: "Margret Marmajuke",
  //     age: "16",
  //     col: "yellow",
  //     dob: "31/01/1999",
  //   },
  // ];

  const [data, setData] = useState(mockData(12));
  const status = useAppSelector((state) => state.CoreSets.status);
  const filePath = useAppSelector((state) => state.CoreSets.filePath);

  const availableItems = useAppSelector(selectAvailableItems);

  useEffect(() => {
    window.electron.ipcRenderer.sendMessage("coreSetsWindowMessage", "loaded");

    console.log(data, availableItems);

    coreSetItems = Array.from(availableItems) as Array<CoreSupportEntry>;
    console.log(tableRef.current, data);

    console.log(data, availableItems);
  }, [availableItems]);

  const columns: Column[] = [
    {
      id: "title",
      name: "Title",
      field: "title",
      sortable: true,
      minWidth: 100,
    },
    {
      id: "duration",
      name: "Duration (days)",
      field: "duration",
      sortable: true,
      minWidth: 100,
    },
    {
      id: "%",
      name: "% Complete",
      field: "percentComplete",
      sortable: true,
      minWidth: 100,
    },
    {
      id: "start",
      name: "Start",
      field: "start",
      formatter: Formatters.dateIso,
    },
    {
      id: "finish",
      name: "Finish",
      field: "finish",
      formatter: Formatters.dateIso,
    },
    {
      id: "effort-driven",
      name: "Effort Driven",
      field: "effortDriven",
      sortable: true,
      minWidth: 100,
    },
  ];

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

function mockData(count: number) {
  // mock a dataset
  const mockDataset: any[] = [];
  for (let i = 0; i < count; i++) {
    const randomYear = 2000 + Math.floor(Math.random() * 10);
    const randomMonth = Math.floor(Math.random() * 11);
    const randomDay = Math.floor(Math.random() * 29);
    const randomPercent = Math.round(Math.random() * 100);

    mockDataset[i] = {
      id: i,
      title: "Task " + i,
      duration: Math.round(Math.random() * 100) + "",
      percentComplete: randomPercent,
      start: new Date(randomYear, randomMonth + 1, randomDay),
      finish: new Date(randomYear + 1, randomMonth + 1, randomDay),
      effortDriven: i % 5 === 0,
    };
  }

  return mockDataset;
}

function selectFileMenuButtonClicked() {
  window.electron.ipcRenderer.sendMessage(
    "coreSetsWindowMessage",
    "selectFileMenuButtonClicked"
  );
}
