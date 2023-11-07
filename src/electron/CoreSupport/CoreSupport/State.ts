import { BehaviorSubject, Observable } from "rxjs";
import { CoreSupportPriceListEntry } from "./shared";

export class CoreSupportState {
  private lastRefreshedSubject = new BehaviorSubject<number>(0);

  public get lastRefreshed$(): Observable<number> {
    return this.lastRefreshedSubject.asObservable();
  }

  public get lastRefreshed(): number {
    return this.lastRefreshedSubject.getValue();
  }

  public setLastRefreshed(lastRefreshed: number) {
    this.lastRefreshedSubject.next(lastRefreshed);
  }

  /*
   * File Path ##########################################################
   */
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

  /**
   * Distributors ##########################################################
   */
  private allDistributorsSubject = new BehaviorSubject<Set<string>>(
    new Set<string>()
  );

  public get allDistributors$(): Observable<Set<string>> {
    return this.allDistributorsSubject.asObservable();
  }

  public get allDistributors(): Set<string> {
    return this.allDistributorsSubject.getValue();
  }

  public setAllDistributors(allDistributors: Set<string>) {
    this.allDistributorsSubject.next(allDistributors);
  }

  /**
   * Selected Distributors ##########################################################
   */
  private selectedDistributorsSubject = new BehaviorSubject<Set<string>>(
    new Set<string>()
  );

  public get selectedDistributors$(): Observable<Set<string>> {
    return this.selectedDistributorsSubject.asObservable();
  }

  public get selectedDistributors(): Set<string> {
    return this.selectedDistributorsSubject.getValue();
  }

  public setSelectedDistributors(selectedDistributors: Set<string>) {
    this.selectedDistributorsSubject.next(selectedDistributors);
  }

  /**
   * Our Items ##########################################################
   */
  private ourDistributorsEntriesSubject = new BehaviorSubject<
    Array<CoreSupportPriceListEntry>
  >([]);

  public get ourDistributorsEntries$(): Observable<
    Array<CoreSupportPriceListEntry>
  > {
    return this.ourDistributorsEntriesSubject.asObservable();
  }

  public get ourDistributorsEntries(): Array<CoreSupportPriceListEntry> {
    return this.ourDistributorsEntriesSubject.getValue();
  }

  public setOurDistributorEntries(
    ourDistributorsEntries: Array<CoreSupportPriceListEntry>
  ) {
    this.ourDistributorsEntriesSubject.next(ourDistributorsEntries);
  }

  /**
   * All Entries ##########################################################
   */
  private allEntriesSubject = new BehaviorSubject<
    Array<CoreSupportPriceListEntry>
  >([]);

  public get allEntries$(): Observable<Array<CoreSupportPriceListEntry>> {
    return this.allEntriesSubject.asObservable();
  }

  public get allEntries(): Array<CoreSupportPriceListEntry> {
    return this.allEntriesSubject.getValue();
  }

  public setAllEntries(allEntries: Array<CoreSupportPriceListEntry>) {
    this.allEntriesSubject.next(allEntries);
  }
}
