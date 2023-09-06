
import "../css/coreSets.css"

console.log("From CoreSets.tsx");


const selectFileMenuButton = document.getElementById("selectFileMenuButton");
if (selectFileMenuButton) {
  selectFileMenuButton.addEventListener("click", function () {
    selectFileMenuButtonClicked();
  });
}

function selectFileMenuButtonClicked () {
  window.electron.ipcRenderer.sendMessage(
    "coreSetsWindowMessage",
    "selectFileMenuButtonClicked"
  );
}

