import { google, Auth, sheets_v4, drive_v3 } from "googleapis";
import { BehaviorSubject, Observable } from "rxjs";
import Settings from "../electron/Settings";

import * as path from "path";
import * as fs from "fs";

const includedCertPath = path.join(
  __dirname,
  "Inventory/CertsAndLogs/googleCert.jsons"
);

export class Google {
  private static instances: { [keyFilePath: string]: Google } = {};

  private auth: Auth.GoogleAuth;
  private sheets: sheets_v4.Sheets;
  private drive: drive_v3.Drive;

  private static loadedSubject = new BehaviorSubject<string[]>([]);

  private constructor(keyFilePath: string) {
    console.log("Logging into Google with keyFilePath: " + keyFilePath);

    this.auth = new google.auth.GoogleAuth({
      keyFilename: keyFilePath,
      // Scopes can be specified either as an array or as a single, space-delimited string.
      scopes: ["https://www.googleapis.com/auth/drive"],
    });

    this.sheets = google.sheets({
      version: "v4",
      auth: this.auth,
    });
  }

  static getInstanceFor(keyFilePath: string): Google {
    if (!Google.instances[keyFilePath]) {
      Google.instances[keyFilePath] = new Google(keyFilePath);
      this.addToLoaded(keyFilePath);
    }
    return Google.instances[keyFilePath];
  }

  static addToLoaded(keyFilePath: string) {
    const newLoaded = Google.loadedSubject.getValue();
    newLoaded.push(keyFilePath);
    Google.loadedSubject.next(newLoaded);
  }
  static async loadServiceCert() {
    if (fs.existsSync(includedCertPath)) {
      console.log("We have an included cert!");
      Google.getInstanceFor(includedCertPath);
    } else {
      const certPathToUse = (await Settings.loadJsonLocation()) as string;

      if (certPathToUse && fs.existsSync(certPathToUse)) {
        Google.getInstanceFor(certPathToUse);
      }
    }
  }

  public getSheets(): sheets_v4.Sheets {
    return this.sheets;
  }
  public getDrive(): drive_v3.Drive {
    return this.drive;
  }

  static getSheetsFor(keyFilePath: string): sheets_v4.Sheets {
    return Google.getInstanceFor(keyFilePath).sheets;
  }

  static getLoaded(): Observable<string[]> {
    return Google.loadedSubject.asObservable();
  }
}

Google.loadServiceCert();
