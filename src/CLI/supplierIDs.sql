SELECT 
   TRIM(SI.INV_ScanCode) AS ScanCode, 
   TRIM(ven.VEN_CompanyName) AS Vendor,
   TRIM(ORD_SupplierStockNumber) AS "Supplier Item ID",
   TRIM(OUP.OUP_Name) AS "Unit",
   TRIM(OUP.OUP_Quantity) AS "Unit Quantity",
   TRIM(ORD_QuantityInOrderUnit) AS Quantity,
   ORD_Primary AS "Primary Flag",
   ORD_DefaultSupplier AS "Default",
   ORD_Discontinued  AS "Discontinued"
FROM OrderingInfo
LEFT JOIN StockInventory SI ON ORD_INV_FK = SI.INV_PK AND ORD_INV_CFK = SI.INV_CPK
LEFT JOIN Vendor Ven ON ORD_VEN_FK = Ven.VEN_PK AND ORD_VEN_CFK = Ven.VEN_CPK
LEFT JOIN OrderUnitProfiles OUP on ORD_OUP_FK = OUP.OUP_PK AND ORD_OUP_CFK = OUP.OUP_CPK
