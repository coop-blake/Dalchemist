import { app, BrowserWindow } from "electron";
import Main from "./electron-main";
import { start } from "../Google/addDrop/addDrop"

Main.main(app, BrowserWindow);


start(() => {
  console.log("Web Server Started");
  Main.start();
})
  .then(() => { })
  .catch((error: Error) => {
    Main.startError(error)
    console.error(error.message);
  });

