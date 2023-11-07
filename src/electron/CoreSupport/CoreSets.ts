import { BehaviorSubject, Observable } from "rxjs";
import { Inventory } from "../../Google/Inventory/Inventory";
import { CoreSupport } from "./CoreSupport/CoreSupport";
import path from "path";
import {
  CoreSetsStatus,
  CoreSupportPriceListEntry,
  CoreSupportReportEntry,
} from "./shared";
import { resolveHtmlPath } from "../Utility";
import { app, BrowserWindow, ipcMain, IpcMainInvokeEvent } from "electron";
import Settings from "../Settings";
import DalchemistApp from "../DalchemistApp";
import {
  handleWindowMessage,
  sendCoreSetsData,
  handleUserSelectedCoreSetDistributors,
} from "./ipc";
import { processReportEntries } from "./Report";
/**
 * CoreSets
 * Singleton Instance with State that handles the CoreSets BackEnd for Electron
 */
export class CoreSets {
  private static instance: CoreSets;
  static state: CoreSetsState;

  private CoreSupportReader: CoreSupport;

  private coreSetsWindow: BrowserWindow | null = null;

  private constructor() {
    CoreSets.state = new CoreSetsState();
    CoreSets.state.setStatus(CoreSetsStatus.Starting);

    this.CoreSupportReader = new CoreSupport();

    CoreSets.state.setCoreSupportPriceListFilePath(
      Settings.getCoreSetsExcelFilePath()
    );

    Inventory.getInstance();

    //todo combine trigger with CoreSet state
    Inventory.state.lastRefreshCompleted$.subscribe((lastRefresh: number) => {
      if (lastRefresh > 0) {
        if (CoreSets.state.coreSupportPriceListFilePath !== "") {
          if (this.CoreSupportReader.doesKnownFileExist()) {
            setTimeout(async () => {
              await this.loadCoreSetsExcelFile();
              processReportEntries();
            });
          } else {
            CoreSets.state.setStatus(CoreSetsStatus.NoFileAtPath);
          }
        } else {
          CoreSets.state.setStatus(CoreSetsStatus.NoFilePath);
        }
      }
    });

    CoreSets.state.userSelectedCoreSetDistributors$.subscribe(
      async (distributors) => {
        console.log("CoreSets Distributors", distributors);
        await this.loadCoreSetsExcelFile();
        processReportEntries();
      }
    );
  }

  private reloadAnfRefresh() {}

  static get CoreSupportPriceListState() {
    return CoreSets.getInstance().CoreSupportReader.getState();
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
      CoreSets.state.setCoreSupportPriceListFilePath(selectedFile);
      this.loadCoreSetsExcelFile();
    }
  }

  async loadCoreSetsExcelFile() {
    CoreSets.state.setStatus(CoreSetsStatus.Loading);

    const lastUpdated = await this.CoreSupportReader.loadCoreSetsExcelFile();
    if (lastUpdated > 0) {
      const coreSetEntriesArray = this.CoreSupportReader.getEntries();
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
          sendCoreSetsData();

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
          nodeIntegration: false,
        },
      });

      this.coreSetsWindow.on("closed", () => {
        this.coreSetsWindow = null;
        ipcMain.removeListener("coreSetsWindowMessage", handleWindowMessage);
      });
      sendStateChangesToWindow();
      ipcMain.on("coreSetsWindowMessage", handleWindowMessage);
      ipcMain.on(
        "setCoreSetsDistributors",
        handleUserSelectedCoreSetDistributors
      );
    }

    return this.coreSetsWindow;
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
  private coreSupportPriceListFilePathSubject = new BehaviorSubject<string>("");
  public get coreSupportPriceListFilePath$(): Observable<string> {
    return this.coreSupportPriceListFilePathSubject.asObservable();
  }
  public get coreSupportPriceListFilePath(): string {
    return this.coreSupportPriceListFilePathSubject.getValue();
  }
  public setCoreSupportPriceListFilePath(filePath: string) {
    this.coreSupportPriceListFilePathSubject.next(filePath);
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
  private coreSetItemsSubject = new BehaviorSubject<
    CoreSupportPriceListEntry[]
  >([]);
  public get coreSetItems(): CoreSupportPriceListEntry[] {
    return this.coreSetItemsSubject.getValue();
  }
  public get coreSetItems$(): Observable<CoreSupportPriceListEntry[]> {
    return this.coreSetItemsSubject.asObservable();
  }
  public setCoreSetItems(coreSetItems: CoreSupportPriceListEntry[]) {
    this.coreSetItemsSubject.next(coreSetItems);
  }

  //All Core Set Distributors
  private allCoreSetDistributorsSubject = new BehaviorSubject<string[]>([]);
  public get allCoreSetDistributors$(): Observable<string[]> {
    return this.allCoreSetDistributorsSubject.asObservable();
  }
  public get allCoreSetDistributors(): string[] {
    return this.allCoreSetDistributorsSubject.getValue();
  }
  public setAllCoreSetDistributors(distributors: string[]) {
    this.allCoreSetDistributorsSubject.next(distributors);
  }

  //Core Set Distributors
  private userSelectedCoreSetDistributorsSubject = new BehaviorSubject<
    string[]
  >([]);
  public get userSelectedCoreSetDistributors$(): Observable<string[]> {
    return this.userSelectedCoreSetDistributorsSubject.asObservable();
  }
  public get userSelectedCoreSetDistributors(): string[] {
    if (this.userSelectedCoreSetDistributorsSubject.getValue().length == 0) {
      this.userSelectedCoreSetDistributorsSubject.next(
        Settings.getCoreSetDistributors()
      );
      return Settings.getCoreSetDistributors();
    } else {
      return this.userSelectedCoreSetDistributorsSubject.getValue();
    }
  }
  public setUserSelectedCoreSetDistributors(distributors: string[]) {
    Settings.setCoreSetDistributors(distributors);
    this.userSelectedCoreSetDistributorsSubject.next(distributors);
  }

  //Report Entries
  private reportEntriesSubject = new BehaviorSubject<CoreSupportReportEntry[]>(
    []
  );
  public get reportEntries(): CoreSupportReportEntry[] {
    return this.reportEntriesSubject.getValue();
  }
  public get reportEntries$(): Observable<CoreSupportReportEntry[]> {
    return this.reportEntriesSubject.asObservable();
  }
  public setReportEntries(reportEntries: CoreSupportReportEntry[]) {
    this.reportEntriesSubject.next(reportEntries);
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

      // coreSetsWindow.webContents.send(
      //   "CoreSetNumberOfCoreSupportItems",
      //   CoreSets.getInstance().getCoreSupport().getNumberOfEntries()
      // );

      // coreSetsWindow.webContents.send(
      //   "CoreSetNumberOfCoreSupportItemsFromOurDistributors",
      //   CoreSets.getInstance().getCoreSupport().getNumberOfItemsAvailable()
      // );
    }
  });
  CoreSets.state.coreSupportPriceListFilePath$.subscribe(async (filePath) => {
    const coreSetsWindow = await CoreSets.getInstance().getCoreSetsWindow();
    coreSetsWindow.webContents.send("CoreSetFilePathUpdated", filePath);
  });

  CoreSets.state.status$.subscribe(async (status) => {
    const coreSetsWindow = await CoreSets.getInstance().getCoreSetsWindow();

    coreSetsWindow.webContents.send("CoreSetStatusUpdated", status);
  });

  CoreSets.state.reportEntries$.subscribe(async (reportEntries) => {
    const coreSetsWindow = await CoreSets.getInstance().getCoreSetsWindow();

    coreSetsWindow.webContents.send("CoreSetReportEntries", reportEntries);
  });

  CoreSets.state.allCoreSetDistributors$.subscribe(async (distributors) => {
    const coreSetsWindow = await CoreSets.getInstance().getCoreSetsWindow();
    coreSetsWindow.webContents.send("CoreSetAllDistributors", distributors);
  });

  CoreSets.state.userSelectedCoreSetDistributors$.subscribe(
    async (distributors) => {
      const coreSetsWindow = await CoreSets.getInstance().getCoreSetsWindow();

      coreSetsWindow.webContents.send(
        "CoreSetUserSelectedDistributors",
        distributors
      );
    }
  );
};
