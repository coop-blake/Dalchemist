import { createRoot } from "react-dom/client";
import App from "../../Main/View/App";

import {
  setStatus as setMainStatus,
  setErrorMessage as setMainErrorMessage,
} from "../../Main/View/MainSlice";

import { store } from "../../Main/View/store";
import React from "react";

const container = document.getElementById("root") as HTMLElement;
if (container) {
  const root = createRoot(container);
  //Set up Listeners that update state

  window.electron.ipcRenderer.on("status", (message: string) => {
    store.dispatch(setMainStatus(message));
  });
  window.electron.ipcRenderer.on("error", (message: string) => {
    store.dispatch(setMainErrorMessage(message));
  });

  //Render app and send loaded message to backend
  root.render(
    <App
      onLoad={() => {
        window.electron.ipcRenderer.sendMessage("mainWindowMessage", "loaded");
      }}
    />
  );
}
