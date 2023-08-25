import { google, Auth, sheets_v4 } from "googleapis";

export class Google {
  private static instances: { [keyFilePath: string]: Google } = {};
  private auth: Auth.GoogleAuth;

  private sheets: sheets_v4.Sheets;

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
    }
    return Google.instances[keyFilePath];
  }

  static getSheetsFor(keyFilePath: string): sheets_v4.Sheets {
    return Google.getInstanceFor(keyFilePath).sheets;
  }
}
