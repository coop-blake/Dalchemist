import { google, Auth, sheets_v4, drive_v3 } from "googleapis";
import { BehaviorSubject, Observable } from "rxjs";
//import Settings from "../App/Settings";

import path from "path";
import * as fs from "fs";

// Use __filename to get the current script file
const scriptDir = path.dirname(__filename);

// Use process.cwd() to get the current working directory
const workingDir = process.cwd();

//const scriptDir = __dirname;

// Use process.cwd() to get the current working directory
///const workingDir = __dirname;

const includedCertDevPath = path.join(
  scriptDir,
  "Inventory/CertAndLogs/googleCert.json"
);

// const includedCertProdPath = path.join(
//   workingDir,
//   "../../../CertAndLogs/googleCert.json"
// );

const includedCertProdPath = path.join(scriptDir, "googleCert.json");

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
      scopes: ["https://www.googleapis.com/auth/drive"]
    });

    this.sheets = google.sheets({
      version: "v4",
      auth: this.auth
    });

    this.drive = google.drive({
      version: "v3",
      auth: this.auth
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
    if (fs.existsSync(includedCertDevPath)) {
      console.log("We have a Dev included cert!");
      Google.getInstanceFor(includedCertDevPath);
    } else if (fs.existsSync(includedCertProdPath)) {
      console.log("We have a Production included cert!");
      Google.getInstanceFor(includedCertProdPath);
    } else {
      console.log("We DONT have a Dev included cert!", includedCertDevPath);

      console.log(
        "We Dont have a Production included cert!",
        includedCertProdPath
      );

      //   const certPathToUse = (await Settings.loadJsonLocation()) as string;

      //   if (certPathToUse && fs.existsSync(certPathToUse)) {
      //     Google.getInstanceFor(certPathToUse);
      //   } else {
      //     throw Error("Cert Path in Settings Invalid");
      //   }
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

Google.loadServiceCert()
  .then()
  .catch((error: Error) => {
    //todo Add a state and write errors to it
    console.error(error);
  });
