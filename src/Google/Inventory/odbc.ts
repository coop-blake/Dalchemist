import odbc from "odbc";

const query =
  "SELECT " +
  "TRIM(SI.INV_ScanCode) AS ScanCode," +
  "TRIM(PCD_Price_pl1) AS Price, " +
  "TRIM(DP.DIS_Description) AS Discount," +
  "TRIM(PCD_WRKName) AS Worksheet, " +
  "TRIM(PCD_PSWStartDate) AS StartDate, " +
  "TRIM(PCD_PSWEndDate) AS EndDate " +
  "FROM PriceChangeData " +
  "LEFT JOIN   DiscountProfiles DP ON PCD_DIS_FK_pl1 = DP.DIS_PK AND PCD_DIS_CFK_pl1 = DP.DIS_CPK " +
  "LEFT JOIN   StockInventory SI ON PCD_INV_FK = SI.INV_PK AND PCD_INV_CFK = SI.INV_CPK " +
  "WHERE PCD_PSWEndDate > NOW();";

export const connection = odbc.connect("DSN=Prototype", (error, connection) => {
  connection.query(query, (error, result) => {
    if (error) {
      console.error(error);
    }
    console.log(result);
  });
});
