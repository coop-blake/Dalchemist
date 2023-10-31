import { BehaviorSubject, Observable } from "rxjs";
import { Inventory } from "../../Google/Inventory/Inventory";

import { CoreSupport } from "./CoreSupport";
import path from "path";

import { CoreSetsStatus, CoreSupportEntry } from "./shared";
import { resolveHtmlPath } from "../Utility";

import { app, BrowserWindow } from "electron";

import DalchemistApp from "../DalchemistApp";
import { PriceChangeWorksheets } from "../PriceChangeWorksheets/PriceChangeWorksheets";

export class CoreSets {
  private static instance: CoreSets;
  static state: CoreSetsState;

  private CoreSupportReader: CoreSupport;

  private coreSetsWindow: BrowserWindow | null = null;

  private constructor() {
    CoreSets.state = new CoreSetsState();
    CoreSets.state.setStatus(CoreSetsStatus.Starting);

    this.CoreSupportReader = new CoreSupport();

    CoreSets.state.setFilePath(this.CoreSupportReader.getFilePath());

    Inventory.getInstance();

    Inventory.state.lastRefreshCompleted$.subscribe((lastRefresh: number) => {
      if (lastRefresh > 0) {
        if (this.CoreSupportReader.getFilePath() !== "") {
          if (this.CoreSupportReader.doesKnownFileExist()) {
            setTimeout(() => {
              this.loadCoreSetsExcelFile();
            });
          } else {
            CoreSets.state.setStatus(CoreSetsStatus.NoFileAtPath);
          }
        } else {
          CoreSets.state.setStatus(CoreSetsStatus.NoFilePath);
        }
      }
    });
  }

  static getInstance(): CoreSets {
    if (!CoreSets.instance) {
      CoreSets.instance = new CoreSets();
    }
    return CoreSets.instance;
  }
  static reloadCoreSupport() {
    CoreSets.getInstance().getCoreSupport().loadCoreSetsExcelFile();
  }

  getCoreSupport() {
    return this.CoreSupportReader;
  }

  async selectCoreSetsFilePath() {
    const selectedFile = await this.CoreSupportReader.selectFilePath();

    if (selectedFile !== "") {
      CoreSets.state.setFilePath(selectedFile);
      this.loadCoreSetsExcelFile();
    }
  }

  async loadCoreSetsExcelFile() {
    CoreSets.state.setStatus(CoreSetsStatus.Loading);

    const lastUpdated = await this.CoreSupportReader.loadCoreSetsExcelFile();
    if (lastUpdated > 0) {
      const coreSetEntriesArray = Array.from(
        this.CoreSupportReader.entries.values()
      );
      if (coreSetEntriesArray.length > 0) {
        CoreSets.state.setCoreSetItems(coreSetEntriesArray);
        CoreSets.state.setStatus(CoreSetsStatus.Running);
      } else {
        CoreSets.state.setStatus(CoreSetsStatus.UnexpectedFile);
      }
      CoreSets.state.setCoreSetItems(coreSetEntriesArray);
    } else {
      CoreSets.state.setStatus(CoreSetsStatus.UnexpectedFile);
    }
    CoreSets.state.setLastRefreshCompleted(lastUpdated);
  }

  public async showCoreSetsWindow() {
    const coreSetsWindow = await this.getCoreSetsWindow();
    const getIndexPath = resolveHtmlPath("index.html", "/CoreSets");
    console.log("CoreSets getIndexPath", getIndexPath);

    if (coreSetsWindow !== null) {
      coreSetsWindow
        .loadURL(getIndexPath)
        .then(() => {
          this.sendCoreSetsData();

          coreSetsWindow.show();
        })
        .catch((error: Error) => {
          console.error(error);
        });
    }
  }

  public async getCoreSetsWindow(): Promise<BrowserWindow> {
    if (this.coreSetsWindow === null) {
      await DalchemistApp.awaitOnReady();

      const preloadPath = app.isPackaged
        ? path.join(__dirname, "preloadCoreSets.js")
        : path.join(
            __dirname,
            "../../../build/CoreSupport/View/preloadCoreSets.js"
          );
      console.log("Add Drop preload path", preloadPath);
      this.coreSetsWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        show: false,
        webPreferences: {
          preload: preloadPath, // Load preload script for the input dialog
          contextIsolation: true,
          nodeIntegration: false
        }
      });

      this.coreSetsWindow.on("closed", () => {
        this.coreSetsWindow = null;
      });
      sendStateChangesToWindow();
    }

    return this.coreSetsWindow;
  }

  private sendCoreSetsData() {
    const coreSetsWindow = this.coreSetsWindow;
    if (coreSetsWindow !== null) {
      coreSetsWindow.webContents.send(
        "CoreSetEntriesUpdated",
        CoreSets.state.coreSetItems
      );
      coreSetsWindow.webContents.send(
        "CoreSetStatusUpdated",
        CoreSets.state.status
      );

      coreSetsWindow.webContents.send(
        "CoreSetFilePathUpdated",
        CoreSets.state.filePath
      );

      coreSetsWindow.webContents.send(
        "CoreSetNumberOfCoreSupportItems",
        CoreSets.getInstance().getCoreSupport().getNumberOfEntries()
      );

      coreSetsWindow.webContents.send(
        "CoreSetNumberOfCoreSupportItemsFromOurDistributors",
        CoreSets.getInstance().getCoreSupport().getNumberOfItemsAvailable()
      );

      coreSetsWindow.webContents.send(
        "PriceChangeWorksheetsStatus",
        PriceChangeWorksheets.state.status
      );
      coreSetsWindow.webContents.send(
        "PriceChangeWorksheetsFolderPath",
        PriceChangeWorksheets.state.folderPath
      );
      coreSetsWindow.webContents.send(
        "PriceChangeWorksheetsWorksheets",
        PriceChangeWorksheets.state.worksheets
      );
    }
  }
}

export class CoreSetsState {
  //Status
  private statusSubject = new BehaviorSubject<CoreSetsStatus>(
    CoreSetsStatus.Starting
  );
  public get status$(): Observable<CoreSetsStatus> {
    return this.statusSubject.asObservable();
  }
  public get status(): CoreSetsStatus {
    return this.statusSubject.getValue();
  }
  public setStatus(status: CoreSetsStatus) {
    this.statusSubject.next(status);
  }

  //File Path
  private filePathSubject = new BehaviorSubject<string>("");
  public get filePath$(): Observable<string> {
    return this.filePathSubject.asObservable();
  }
  public get filePath(): string {
    return this.filePathSubject.getValue();
  }
  public setFilePath(filePath: string) {
    this.filePathSubject.next(filePath);
  }

  //Last refresh
  private lastRefreshCompletedSubject = new BehaviorSubject<number>(0);
  public get lastRefreshCompleted$(): Observable<number> {
    return this.lastRefreshCompletedSubject.asObservable();
  }
  public setLastRefreshCompleted(time: number) {
    this.lastRefreshCompletedSubject.next(time);
  }

  //Core Set Items
  private coreSetItemsSubject = new BehaviorSubject<CoreSupportEntry[]>([]);
  public get coreSetItems(): CoreSupportEntry[] {
    return this.coreSetItemsSubject.getValue();
  }
  public get coreSetItems$(): Observable<CoreSupportEntry[]> {
    return this.coreSetItemsSubject.asObservable();
  }
  public setCoreSetItems(coreSetItems: CoreSupportEntry[]) {
    this.coreSetItemsSubject.next(coreSetItems);
  }
}

CoreSets.getInstance();

const sendStateChangesToWindow = () => {
  CoreSets.state.lastRefreshCompleted$.subscribe(async (lastRefreshed) => {
    if (lastRefreshed > 0) {
      console.log(
        "Sending Core Set items to window",
        CoreSets.state.coreSetItems
      );
      const coreSetsWindow = await CoreSets.getInstance().getCoreSetsWindow();
      coreSetsWindow.webContents.send(
        "CoreSetEntriesUpdated",
        CoreSets.state.coreSetItems
      );

      coreSetsWindow.webContents.send(
        "CoreSetNumberOfCoreSupportItems",
        CoreSets.getInstance().getCoreSupport().getNumberOfEntries()
      );

      coreSetsWindow.webContents.send(
        "CoreSetNumberOfCoreSupportItemsFromOurDistributors",
        CoreSets.getInstance().getCoreSupport().getNumberOfItemsAvailable()
      );
    }
  });
  CoreSets.state.filePath$.subscribe(async (filePath) => {
    const coreSetsWindow = await CoreSets.getInstance().getCoreSetsWindow();
    coreSetsWindow.webContents.send("CoreSetFilePathUpdated", filePath);
  });

  CoreSets.state.status$.subscribe(async (status) => {
    const coreSetsWindow = await CoreSets.getInstance().getCoreSetsWindow();

    coreSetsWindow.webContents.send("CoreSetStatusUpdated", status);
  });

  PriceChangeWorksheets.state.status$.subscribe(async (status) => {
    const coreSetsWindow = await CoreSets.getInstance().getCoreSetsWindow();

    coreSetsWindow.webContents.send("PriceChangeWorksheetsStatus", status);
  });

  PriceChangeWorksheets.state.folderPath$.subscribe(async (filePath) => {
    const coreSetsWindow = await CoreSets.getInstance().getCoreSetsWindow();

    coreSetsWindow.webContents.send(
      "PriceChangeWorksheetsFolderPath",
      filePath
    );
  });

  PriceChangeWorksheets.state.worksheets$.subscribe(async (worksheets) => {
    const coreSetsWindow = await CoreSets.getInstance().getCoreSetsWindow();
    coreSetsWindow.webContents.send(
      "PriceChangeWorksheetsWorksheets",
      worksheets
    );
  });
};
