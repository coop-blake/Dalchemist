import { BehaviorSubject, Observable } from "rxjs";
import { PriceChangeWorksheetsStatus } from "./shared";

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
}
PriceChangeWorksheets.getInstance();
