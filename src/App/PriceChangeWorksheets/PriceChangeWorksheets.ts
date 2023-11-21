import { BehaviorSubject, Observable } from "rxjs";
import { PriceChangeWorksheetsStatus } from "./shared";
import PriceChangeWorksheetImporter, {
  PriceChangeWorksheetEntry
} from "TextImporters/PriceChangeWorksheet";
import PriceChangeWorksheetsProcessor from "../../Processors/PriceChangeWorksheets";

import Settings from "../Settings";

export class PriceChangeWorksheets {
  private static instance: PriceChangeWorksheets;
  static state: PriceChangeWorksheetsState;

  static worksheets: Map<string, PriceChangeWorksheetImporter> =
    new Map() as Map<string, PriceChangeWorksheetImporter>;

  private constructor() {
    PriceChangeWorksheets.state = new PriceChangeWorksheetsState();
    PriceChangeWorksheets.state.setStatus(PriceChangeWorksheetsStatus.Starting);
    this.loadWorksheets();
  }

  loadWorksheets(): void {
    if (Settings.doesPriceChangeFolderLocationExist()) {
      console.log("Looking for");

      PriceChangeWorksheets.state.setStatus(
        PriceChangeWorksheetsStatus.Loading
      );
      const folderPath = Settings.getPriceChangeFolderLocation();

      const worksheetImporter = new PriceChangeWorksheetsProcessor(folderPath);
      setTimeout(async () => {
        await worksheetImporter.initialize();

        const loadedWorksheets = [
          ...worksheetImporter.priceChangeWorksheets
        ].map((worksheetImporter: PriceChangeWorksheetImporter) => {
          return worksheetImporter.fileName;
        });
        worksheetImporter.forEachWorksheet((worksheet) => {
          PriceChangeWorksheets.worksheets.set(
            worksheet.fileName ?? "",
            worksheet
          );
        });

        //PriceChangeWorksheets.state.setWorksheets(loadedWorksheets);
        PriceChangeWorksheets.state.setStatus(
          PriceChangeWorksheetsStatus.Running
        );
        console.log("Loaded running worksheets", loadedWorksheets);
      }, 0);
    } else {
      console.log("could not find folder path");
    }
  }

  static getInstance(): PriceChangeWorksheets {
    if (!PriceChangeWorksheets.instance) {
      PriceChangeWorksheets.instance = new PriceChangeWorksheets();
    }
    return PriceChangeWorksheets.instance;
  }

  static getFolderPath() {
    Settings.getPriceChangeFolderLocation();
  }

  static async selectFolderPath() {
    console.log("selectFolderPath😪");

    const folderPath = await Settings.selectPriceChangeFolderLocation();
    console.log("selectFolderPath😪", folderPath);
    if (folderPath && folderPath.length > 0) {
      PriceChangeWorksheets.state.setFolderPath(folderPath);
      PriceChangeWorksheets.getInstance().loadWorksheets();
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
  public setFolderPath(folderPath: string) {
    this.folderPathSubject.next(folderPath);
  }
  //Worksheets
  private worksheetsSubject = new BehaviorSubject<PriceChangeWorksheetEntry[]>(
    []
  );
  public get worksheets(): PriceChangeWorksheetEntry[] {
    return this.worksheetsSubject.getValue();
  }
  public get worksheets$(): Observable<PriceChangeWorksheetEntry[]> {
    return this.worksheetsSubject.asObservable();
  }
  public setWorksheets(worksheets: PriceChangeWorksheetEntry[]) {
    this.worksheetsSubject.next(worksheets);
  }
}
PriceChangeWorksheets.getInstance();
