SELECT 
    TRIM(SI.INV_ScanCode) AS ScanCode, 
    ROUND(PCD_Price_pl1, 2) AS Price, 
    TRIM(DP.DIS_Description) AS Discount,
    TRIM(PCD_WRKName) AS Worksheet, 
    TRIM(PCD_PSWEndDate) AS EndDate, 
    TRIM(PCD_PSWStartDate) AS StartDate 
FROM PriceChangeData 
LEFT JOIN   DiscountProfiles DP ON PCD_DIS_FK_pl1 = DP.DIS_PK  
LEFT JOIN   StockInventory SI ON PCD_INV_FK = SI.INV_PK   
WHERE PCD_PSWEndDate > NOW();