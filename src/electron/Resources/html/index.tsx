import { createRoot } from 'react-dom/client';
import App from '../../View/App';

import { setAvailableItems as setCoreSetAvailableItems,setErrorMessage } from '../../CoreSupport/View/CoreSetSlice';

import { setStatus as setMainStatus, setErrorMessage as setMainErrorMessage} from "../../View/MainSlice"


import {store} from '../../View/store'


const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);



//Set up Listeners that update state
window.electron.ipcRenderer.on(
  "CoreSetEntriesUpdated",
  (coreSetItemsArray: Array<CoreSupportEntry>) => {
    if (typeof coreSetItemsArray !== "undefined") {
      store.dispatch(setCoreSetAvailableItems(coreSetItemsArray))
    }
  }
);

window.electron.ipcRenderer.on("status", (message: string) => {
  console.log(message)
  store.dispatch(setMainStatus(message));
});
window.electron.ipcRenderer.on("error", (message: string) => {
  console.log(message)

  store.dispatch(setMainErrorMessage(message));
});

//Render app and send loaded message to backend
root.render(<App onLoad={() => {
  window.electron.ipcRenderer.sendMessage(
    "mainWindowMessage",
    "loaded"
  );
}}/>);


/*
console.log("From index.tsx");

import icon from "../images/Icon.svg";
import "../css/index.css";

window.electron.ipcRenderer.on("status", (message) => {
  // eslint-disable-next-line no-console
  updateStatusMessage(message);
});

window.electron.ipcRenderer.on("error", (message) => {
  // eslint-disable-next-line no-console
  updateErrorMessage(message);
});

function setup() {
  const iconImage = document.getElementById("iconImage") as HTMLImageElement;
  console.log(icon);
  if (iconImage) {
    iconImage.src = icon;
  }

  const inventoryMenuButton = document.getElementById("inventoryMenuButton");
  if (inventoryMenuButton) {
    inventoryMenuButton.addEventListener("click", function () {
      inventoryMenuButtonClicked();
    });
  }
  const addDropMenuButton = document.getElementById("addDropMenuButton");
  if (addDropMenuButton) {
    addDropMenuButton.addEventListener("click", function () {
      addDropMenuButtonClicked();
    });
  }
  const closeMenuButton = document.getElementById("closeMenuButton");
  if (closeMenuButton) {
    closeMenuButton.addEventListener("click", function () {
      closeMenuButtonClicked();
    });
  }

  const bodyContainer = document.getElementById("bodyContainer");
  if (bodyContainer) {
    bodyContainer.addEventListener("resize", function (resizeEvent) {
      console.log(resizeEvent);
    });
  }
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

function closeMenuButtonClicked() {
  console.log("closeMenuButtonClicked");
  window.electron.ipcRenderer.sendMessage(
    "mainWindowMessage",
    "closeMenuButtonClicked"
  );
}

function onReady(doThis: () => void) {
  //todo replace with utility function
  document.readyState === "complete" || document.readyState === "interactive"
    ? doThis()
    : document.addEventListener("DOMContentLoaded", () => {
        doThis();
      });
}

onReady(setup);

function updateErrorMessage(error: string) {
  console.log(error);

  onReady(() => {
    const statusContent = document.getElementById("statusContent");
    const iconImage = document.getElementById("iconImage");

    if (statusContent) {
      const errorMessage = error.replace(/'/g, "\\'").replace(/"/g, '\\"');
      statusContent.innerHTML = `Error Loading! </br>${errorMessage}`;
      statusContent.style.color = "red";
    }
    if (iconImage) {
      iconImage.classList.remove("pulsating");
    }
  });
}

function updateStatusMessage(statusMessage: string) {
  console.log(statusMessage);
  onReady(() => {
    const statusContent = document.getElementById("statusContent");

    if (statusContent) {
      statusContent.innerHTML = `${statusMessage
        .replace(/'/g, "\\'")
        .replace(/"/g, '\\"')}`;

      if (statusMessage === "Running") {
        const iconImage = document.getElementById("iconImage");
        if (iconImage) {
          iconImage.classList.remove("pulsating");
        }
        const iconImageContainer =
          document.getElementById("iconImageContainer");
        if (iconImageContainer) {
          iconImageContainer.classList.add("shrink");
        }
        const menuContent = document.getElementById("menuContent");
        if (menuContent) {
          menuContent.classList.add("fadeIn");
        }
        const statusContent = document.getElementById("statusContent");
        if (statusContent) {
          statusContent.classList.add("fadeOut");
        }
        const loaderContainer = document.getElementById("loaderContainer");
        if (loaderContainer) {
          loaderContainer.classList.add("fadeOut");
        }
      }
    }
  });

  window.electron.ipcRenderer.sendMessage(
    "mainWindowMessage",
    "loaded"
  );
}


 */