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

if (
  document.readyState === "complete" ||
  document.readyState === "interactive"
) {
  const iconImage = document.getElementById("iconImage") as HTMLImageElement;
  console.log(icon);
  if (iconImage) {
    iconImage.src = icon;
  }
} else {
  document.addEventListener("DOMContentLoaded", () => {});
}

function updateErrorMessage(error) {
  console.log(error);

  if (
    document.readyState === "complete" ||
    document.readyState === "interactive"
  ) {
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
  } else {
    document.addEventListener("DOMContentLoaded", () => {
      updateErrorMessage(error);
    });
  }
}

function updateStatusMessage(statusMessage: string) {
  console.log(statusMessage);
  if (
    document.readyState === "complete" ||
    document.readyState === "interactive"
  ) {
    const statusContent = document.getElementById("statusContent");

    if (statusContent) {
      statusContent.innerHTML = `${statusMessage
        .replace(/'/g, "\\'")
        .replace(/"/g, '\\"')}`;

      if (statusMessage === "Running") {
        const menuContent = document.getElementById("menuContent");
        if (menuContent) {
          menuContent.classList.add("fadeIn");
        }
      }
    }
  } else {
    document.addEventListener("DOMContentLoaded", () => {
      updateStatusMessage(statusMessage);
    });
  }
}

// const receiveMessageFromMain = (message: string) => {
//   console.log(`Received: ${message}`);

//   updateStatusMessage(message);
// };
