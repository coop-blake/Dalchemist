import { BehaviorSubject, Observable } from "rxjs";
import { Inventory } from "../../Google/Inventory/Inventory";

import { CoreSupport } from "./CoreSupport";

import { CoreSetsStatus, CoreSupportEntry } from "./shared";

export class CoreSets {
  private static instance: CoreSets;
  static state: CoreSetsState;

  private CoreSupportReader: CoreSupport;

 

  private constructor() {
    CoreSets.state = new CoreSetsState();
    CoreSets.state.setStatus(CoreSetsStatus.Starting);

    this.CoreSupportReader = new CoreSupport();


    CoreSets.state.setFilePath(this.CoreSupportReader.getFilePath());

    Inventory.getInstance();
    

    Inventory.state.lastRefreshCompleted$.subscribe((lastRefresh: number)=>{
      if(lastRefresh > 0 ){
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
    })


  }

  static getInstance(): CoreSets {
    if (!CoreSets.instance) {
      CoreSets.instance = new CoreSets();
    }
    return CoreSets.instance;
  }
  static reloadCoreSupport() {
    CoreSets.getInstance().getCoreSupport().loadCoreSetsExcelFile()
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
