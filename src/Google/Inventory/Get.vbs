' Get the script directory path
Set objFSO = CreateObject("Scripting.FileSystemObject")
scriptDirectory = objFSO.GetParentFolderName(WScript.ScriptFullName)

' Create the full path for the log file
LogFilePath = objFSO.BuildPath(scriptDirectory, "CertAndLogs\ScriptLog.txt")


' Get the path to fetches folder in script directory
certAndLogsFolderPath = objFSO.BuildPath(scriptDirectory, "CertAndLogs")
' If the CertAndLogs folder path directory does not exist
If NOT (objFSO.FolderExists(certAndLogsFolderPath)) Then
' Create the ferches folder
 objFSO.CreateFolder(certAndLogsFolderPath)
End If

Set logFileObj = objFSO.OpenTextFile(LogFilePath, 8, True)
' Log current timestamp
logFileObj.WriteLine Now & " - Script execution started"

'Import the Database Utility Library
DatabaseLibraryScriptPath = objFSO.BuildPath(scriptDirectory, "DatabaseUtility.vbs")
ExecuteGlobal CreateObject("Scripting.FileSystemObject").OpenTextFile(DatabaseLibraryScriptPath).ReadAll()
'Create the Database Queries and Filenames
northQuery = "SELECT TRIM(inv_scancode) AS inv_scancode, TRIM(brd_name) AS brd_name, TRIM(inv_name) AS inv_name, TRIM(inv_size) AS inv_size, TRIM(inv_receiptalias) inv_receiptalias, inv_discontinued, pi1_description, TRIM(sto_number) AS sto_number, TRIM(dpt_name) AS dpt_name , TRIM(ord_supplierstocknumber) AS ord_supplierstocknumber, ROUND(sib_baseprice,2) AS sib_baseprice,  ord_quantityinorderunit, ROUND(inv_lastcost,2) AS inv_lastcost, ROUND(inv_averagecost,2) AS inv_averagecost, sib_idealmargin, TRIM(ven_companyname) AS ven_companyname, TRIM(oup_name) AS oup_name,  sil_lastsold FROM ecrs.v_InventoryMaster WHERE sto_number = 'RS2' AND NOT inv_scancode LIKE 'zz%' AND ( brd_name <> 'OPEN ITEM' OR brd_name IS NULL)  AND dpt_name NOT IN ('18 SPECIAL EVENTS', '25 DEPOSITS / STORE USE', '30 MEMBERSHIP')"
northTextFileName = "North.txt"
southQuery = "SELECT TRIM(inv_scancode) AS inv_scancode, TRIM(brd_name) AS brd_name, TRIM(inv_name) AS inv_name, TRIM(inv_size) AS inv_size, TRIM(inv_receiptalias) inv_receiptalias, inv_discontinued, pi1_description, TRIM(sto_number) AS sto_number, TRIM(dpt_name) AS dpt_name , TRIM(ord_supplierstocknumber) AS ord_supplierstocknumber, ROUND(sib_baseprice,2) AS sib_baseprice,  ord_quantityinorderunit, ROUND(inv_lastcost,2) AS inv_lastcost, ROUND(inv_averagecost,2) AS inv_averagecost, sib_idealmargin, TRIM(ven_companyname) AS ven_companyname, TRIM(oup_name) AS oup_name,  sil_lastsold FROM ecrs.v_InventoryMaster WHERE sto_number = 'RS1' AND NOT inv_scancode LIKE 'zz%' AND ( brd_name <> 'OPEN ITEM' OR brd_name IS NULL) AND dpt_name NOT IN ('18 SPECIAL EVENTS', '25 DEPOSITS / STORE USE', '30 MEMBERSHIP')"
southTextFileName = "South.txt"
' Data Source name as set up in ODBC Data Sources
dataSourceName = "Prototype"
Wscript.Echo "Getting Datasource:" & dataSourceName
' Attempt Connection
Set connection = GetConnection(dataSourceName)
'If Connection is successful

If connection Is Nothing Then
	'Nothing else to be done without database connection
	Wscript.Echo "Could not get Datasource:" & dataSourceName
	logFileObj.WriteLine Now & " - Error - Could not get Data Source -Script execution halted"
	logFileObj.Close
	Set logFileObj = Nothing

	' Exit the script with exit code 1
	WScript.Quit 1
Else
	Wscript.Echo "Got Datasource:'" & dataSourceName

	'Execute Query on Connection and save result to Fetches folder as text file name
	ExecuteQueryAndWriteToFile connection, northQuery, northTextFileName
	ExecuteQueryAndWriteToFile connection, southQuery, southTextFileName
	' Close the connection
	connection.Close	
End If

logFileObj.WriteLine Now & " - Script execution completed"
logFileObj.Close
Set logFileObj = Nothing
'Decalared we finished as expected
Wscript.Echo "Done"

