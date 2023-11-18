//Resources
import icon from "./resources/images/Icon.svg";
import "./resources/css/index.css";
//State
import { useAppSelector } from "./hooks";

export default function MainView() {
  const mainStatus = useAppSelector((state) => state.Main.status);
  const errorMessage = useAppSelector((state) => state.Main.errorMessage);

  return (
    <div>
      <span
        id="loaderContainer"
        style={{ position: "relative", top: "15px", left: "1px" }}
        className={`${mainStatus === "Running" ? "fadeOut" : ""}`}
      >
        <div className="lds-ripple">
          <div></div>
          <div></div>
        </div>
      </span>
      <br />
      <div
        className={`image-container ${
          mainStatus === "Running" ? "shrink" : ""
        }`}
        id="iconImageContainer"
      >
        <img
          id="iconImage"
          className={`image ${mainStatus !== "Running" ? "pulsating" : ""}`}
          src={icon}
          alt="Dalchemist Image"
        />
      </div>
      <br />
      <div className="content-container">
        <div className="content">
          <span id="title">Dalchemist</span>
          <div
            id="statusContent"
            className={`${mainStatus === "Running" ? "fadeOut" : ""}`}
            style={errorMessage === "" ? {} : { color: "red" }}
          >
            {errorMessage === "" ? mainStatus : errorMessage}
          </div>

          <span
            style={{ opacity: 0 }}
            id="menuContent"
            className={`${mainStatus === "Running" ? "fadeIn" : ""}`}
          >
            <span
              className="menuButton"
              id="inventoryMenuButton"
              onClick={inventoryMenuButtonClicked}
            >
              Inventory
            </span>
            <br />
            <span
              className="menuButton"
              id="addDropMenuButton"
              onClick={addDropMenuButtonClicked}
            >
              Add Drop
            </span>
            <br />
            <span
              className="menuButton"
              id="coreSetsMenuButton"
              onClick={coreSetsMenuButtonClicked}
            >
              Core Sets
            </span>
            <br />
            <span
              className="menuButton"
              id="closeMenuButton"
              onClick={closeMenuButtonClicked}
            >
              Close
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}

function inventoryMenuButtonClicked() {
  console.log("inventoryMenuButtonClicked");
  window.electron.ipcRenderer.sendMessage(
    "mainWindowMessage",
    "inventoryMenuButtonClicked"
  );
}

function addDropMenuButtonClicked() {
  console.log("addDropMenuButtonClicked");
  window.electron.ipcRenderer.sendMessage(
    "mainWindowMessage",
    "addDropMenuButtonClicked"
  );
}
function coreSetsMenuButtonClicked() {
  console.log("coreSetsMenuButtonClicked");
  window.electron.ipcRenderer.sendMessage(
    "mainWindowMessage",
    "coreSetsMenuButtonClicked"
  );
}

function closeMenuButtonClicked() {
  console.log("closeMenuButtonClicked");
  window.electron.ipcRenderer.sendMessage(
    "mainWindowMessage",
    "closeMenuButtonClicked"
  );
}

import {
  setStatus as setMainStatus,
  setErrorMessage as setMainErrorMessage,
} from "./MainSlice";

import { store } from "./store";

window.electron.ipcRenderer.on("status", (message: string) => {
  store.dispatch(setMainStatus(message));
});
window.electron.ipcRenderer.on("error", (message: string) => {
  store.dispatch(setMainErrorMessage(message));
});
