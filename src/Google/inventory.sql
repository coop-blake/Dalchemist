SELECT 
   TRIM(im1.inv_scancode) as "ScanCode",
   TRIM(im1.brd_name) as "Brand",
   TRIM(im1.inv_name) as "Name",
   TRIM(im1.inv_size) as "Size",
   TRIM(im1.inv_receiptalias) as "Receipt Alias",
   TRIM(im1.inv_discontinued) as "North Discontinued",
   TRIM(im2.inv_discontinued) as "South Discontinued",
   TRIM(im1.pi1_description) as "Sub Department",
   TRIM(im1.sto_number) as "Store",
   TRIM(im1.dpt_number) as "Department",
   TRIM(im1.ord_supplierstocknumber) as "Supplier Unit ID",
   ROUND(im1.sib_baseprice, 2) as "Base Price",
   TRIM(im1.ord_quantityinorderunit) as "Quanity",
   ROUND(im1.inv_lastcost, 2) as "Last Cost",
   ROUND(im1.inv_averagecost, 2) as "Average Cost",
   TRIM(im1.sib_idealmargin) as "Ideal Margin",
   TRIM(im1.ven_companyname) as "Default Supplier",
   TRIM(im1.oup_name) as "Unit",
   TRIM(im1.sil_lastsold) as "North Last Sold",
   TRIM(im2.sil_lastsold) as "South Last Sold"
FROM ecrs.v_InventoryMaster im1
JOIN ecrs.v_InventoryMaster im2 ON im1.inv_scancode = im2.inv_scancode AND TRIM(im2.sto_number) = 'RS1'
WHERE Store = 'RS2'
AND NOT ScanCode LIKE 'zz%' 
AND ( Brand <> 'OPEN ITEM' OR Brand IS NULL)  
AND Department NOT IN ('18 SPECIAL EVENTS', '25 DEPOSITS / STORE USE', '30 MEMBERSHIP')
