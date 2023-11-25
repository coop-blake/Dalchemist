import { InputLines } from "../Base";

import odbc from "odbc";

//todo: this importer needs testing

export class OdbcInput implements InputLines {
  dsn: string;
  sqlQuery: string;

  constructor(dsn: string, sqlQuery: string) {
    this.dsn = dsn;
    this.sqlQuery = sqlQuery;
  }

  async getLines() {

    return new Promise<Array<Array<string>>>((resolve) => {
    const returnLines = Array<Array<string>>();
   
    odbc.connect(`DSN=${this.dsn}`, (error, connection) => {
      if (error) {
        console.error(error);
        resolve(returnLines);
      }

      connection.query(this.sqlQuery, (error, result) => {
        if (error) {
          console.error(error);
          resolve(returnLines);
        }
        const header = Object.keys(result[0] as object);
        const data = result.map((row) => Object.values(row as Array<string>));
          resolve([header, ...data]);
      });
    });
  
  });
}

