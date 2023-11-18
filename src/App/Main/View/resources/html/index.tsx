import { createRoot } from "react-dom/client";
import App from "../../App";

import "../css/index.css";

const container = document.getElementById("root") as HTMLElement;
if (container) {
  const root = createRoot(container);
  //Set up Listeners that update state

  //Render app and send loaded message to backend
  root.render(
    <App
      onLoad={() => {
        // window.electron.ipcRenderer.sendMessage("mainWindowMessage", "loaded");
      }}
    />
  );
}
