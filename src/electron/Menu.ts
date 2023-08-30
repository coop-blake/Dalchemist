
import { Menu, dialog} from "electron";
import * as http from "http";
import DalchemistApp from "./DalchemistApp";

import fs from "fs"


export function buildMenu (dalchemistApp : DalchemistApp): Menu {
    const menu = Menu.buildFromTemplate([
        {
          label: "Inventory",
          click() {
            const mainWindow = dalchemistApp.getMainWindow()
            if(mainWindow !== null)
            {
                mainWindow.loadURL("http://localhost:4848/Inventory");
            }
          },
          submenu: [ {
            label: "Find Scan Code",
            click() {
              dalchemistApp.showFindDialog();
            },
          },]
        },
        {
          label: "Add/Drop",
          
          submenu: [{
            label: "Summary",
            click() {
               const mainWindow = dalchemistApp.getMainWindow() 
               if(mainWindow !== null){
                mainWindow.loadURL("http://localhost:4848/");
               }
            }
          },{
            label: "Save Add Drop Price Change",
            click() {
              http
                .get(
                  "http://localhost:4848/addDropPriceChanges.txt",
                  (response) => {
                    let contentToSave = "";
    
                    response.on("data", (chunk) => {
                      contentToSave += chunk;
                    });
    
                    response.on("end", () => {
                      // Show a dialog to choose the file path
                      dialog
                        .showSaveDialog({ defaultPath: "addDropPriceChanges.txt" })
                        .then((result) => {
                          if (!result.canceled && result.filePath) {
                            const filePath = result.filePath;
                            saveStringToFile(contentToSave, filePath);
                          }
                        });
                    });
                  }
                )
                .on("error", (error) => {
                  console.error("Error fetching content:", error);
                });
            },
          },]
        },
        {
          label: "TabImporter",
          click() {
             const mainWindow = dalchemistApp.getMainWindow() 
              mainWindow?.loadURL("https://coop-blake.github.io/tabImporter/");
          },
        },
        
       
        {
          label: process.platform === "win32" ? "Exit" : "Quit",
          click() {
            dalchemistApp.quit();
          },
        },
      ]);

    return menu
}


function saveStringToFile(content: string, filePath: string) {
  try {
    fs.writeFileSync(filePath, content, "utf-8");
    console.log("File saved successfully.");
  } catch (error) {
    console.error("Error saving file:", error);
  }
}
