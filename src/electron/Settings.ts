import Store from "electron-store";
import { dialog } from "electron";

import { app } from "electron";

import fs from "fs";

class Settings {
  private static instance: Settings;
  private store: Store = new Store();

  private constructor() {}

  public static getInstance(): Settings {
    if (!Settings.instance) {
      Settings.instance = new Settings();
    }
    return Settings.instance;
  }

  async selectCoreSetsFile() {
    return new Promise((Resolve, Reject) => {
      dialog
        .showOpenDialog({
          title: "Choose Core Support File",
          properties: ["openFile"],
          filters: [{ name: "Excel Workbook", extensions: ["xlsx"] }],
        })
        .then((result) => {
          Resolve(result.filePaths[0]);
        })
        .catch((error) => {
          Reject(error);
        });
    });
  }
  public saveCoreSetsLocation(location: string) {
    console.log(`Ready, going!!${location}`);

    this.store.set("coreSetsExcelFileLocation", location);
  }

  public doesCoreSetsExcelFileLocationExist(): boolean {
    const coreSetsExcelFilePath = this.store.get(
      "coreSetsExcelFileLocation"
    ) as string;
    return fs.existsSync(coreSetsExcelFilePath);
  }

  public getCoreSetsExcelFilePath() {
    const coreSetsExcelFilePath = this.store.get(
      "coreSetsExcelFileLocation"
    ) as string;
    if (coreSetsExcelFilePath) {
      console.log("coreSetsExcelFilePath", coreSetsExcelFilePath);
      return coreSetsExcelFilePath;
    } else {
      console.log("No coreSetsExcelFilePath in settings or it doesn't exist!");
      return "";
    }
  }

  public async selectCoreSetsLocation(): Promise<string | undefined> {
    return new Promise<string | undefined>((resolve) => {
      app.whenReady().then(async () => {
        const coreSetsExcelFilePath =
          (await this.selectCoreSetsFile()) as string;
        this.saveCoreSetsLocation(coreSetsExcelFilePath);
        resolve(coreSetsExcelFilePath);
      });
    });
  }

  public saveJsonLocation(location: string) {
    console.log(`Ready, going!!${location}`);

    this.store.set("jsonLocation", location);
  }

  public async loadJsonLocation(): Promise<string | undefined> {
    let googleCertPath = this.store.get("jsonLocation") as string;
    if (googleCertPath) {
      console.log("googleCertPath", googleCertPath);
      return googleCertPath;
    } else {
      console.log("No googleCertPath in settings!");

      return new Promise<string | undefined>((resolve) => {
        app.whenReady().then(async () => {
          googleCertPath = (await openJsonFileDialog()) as string;
          this.saveJsonLocation(googleCertPath);
          resolve(googleCertPath);
        });
      });

      this.saveJsonLocation(googleCertPath);
      return googleCertPath;
    }
  }
}

async function openJsonFileDialog(): Promise<string | undefined> {
  console.log("openJsonFileDialog!");

  const result = await dialog.showOpenDialog({
    properties: ["openFile"],
    filters: [{ name: "JSON Files", extensions: ["json"] }],
  });
  console.log("openJsonFileDialog!", result);

  if (!result.canceled && result.filePaths.length > 0) {
    console.log("openJsonFileDialogreturngin!", result.filePaths[0]);

    return result.filePaths[0];
  }

  return undefined;
}

export default Settings.getInstance();
