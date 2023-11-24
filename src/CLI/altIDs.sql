SELECT 
   TRIM(SI.INV_ScanCode) AS parentScanCode, 
   TRIM(ASC_ScanCode) AS ScanCode,
   TRIM(ASC_Quantity) AS Quantity
FROM AdditionalScanCodes
LEFT JOIN StockInventory SI ON ASC_INV_FK = SI.INV_PK AND ASC_INV_CFK = SI.INV_CPK; 