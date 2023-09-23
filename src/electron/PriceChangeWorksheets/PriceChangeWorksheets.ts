import { BehaviorSubject, Observable } from "rxjs";
import { PriceChangeWorksheetsStatus } from "./shared";
import Settings  from "../Settings";

export class PriceChangeWorksheets {
  private static instance: PriceChangeWorksheets;
  static state: PriceChangeWorksheetsState;

  private constructor() {
    PriceChangeWorksheets.state = new PriceChangeWorksheetsState();
    PriceChangeWorksheets.state.setStatus(PriceChangeWorksheetsStatus.Starting);
  }

  static getInstance(): PriceChangeWorksheets {
    if (!PriceChangeWorksheets.instance) {
      PriceChangeWorksheets.instance = new PriceChangeWorksheets();
    }
    return PriceChangeWorksheets.instance;
  }

  static  async selectFolderPath() {
    const folderPath = await Settings.selectPriceChangeFolderLocation();
    console.log(folderPath);
    if (folderPath && folderPath.length > 0) {
      this.folderPath = folderPath;
      return folderPath;
    } else {
      console.log("Failed to select file", folderPath);
      return "";
    }
  }
}

export class PriceChangeWorksheetsState {
  //Status
  private statusSubject = new BehaviorSubject<PriceChangeWorksheetsStatus>(
    PriceChangeWorksheetsStatus.Starting
  );
  public get status$(): Observable<PriceChangeWorksheetsStatus> {
    return this.statusSubject.asObservable();
  }
  public get status(): PriceChangeWorksheetsStatus {
    return this.statusSubject.getValue();
  }
  public setStatus(status: PriceChangeWorksheetsStatus) {
    this.statusSubject.next(status);
  }

   //Folder Path
   private folderPathSubject = new BehaviorSubject<string>("");
   public get folderPath$(): Observable<string> {
     return this.folderPathSubject.asObservable();
   }
   public get folderPath(): string {
     return this.folderPathSubject.getValue();
   }
   public setFilePath(folderPath: string) {
     this.folderPathSubject.next(folderPath);
   }
}
PriceChangeWorksheets.getInstance();
