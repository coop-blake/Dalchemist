' Get the script directory path
Set objFSO = CreateObject("Scripting.FileSystemObject")
scriptDirectory = objFSO.GetParentFolderName(WScript.ScriptFullName)

' Create the full path for the log file
LogFilePath = objFSO.BuildPath(scriptDirectory, "CertAndLogs\AltIDScriptLog.txt")


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
altIDQuery = "SELECT TRIM(ASC_PK) AS privateParentKey, TRIM(ASC_ScanCode) AS ScanCode,TRIM(ASC_Quantity) AS Quantity,TRIM(ASC_INV_FK) AS privateKey FROM ecrs.AdditionalScanCodes;"

altIDFileName = "AltIDs.txt"

stockInventoryQuery = "SELECT TRIM(INV_ScanCode) AS ScanCode,TRIM(INV_PK) AS privateKey FROM ecrs.StockInventory;"
stockInventoryFileName = "StockInventorys.txt"
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
	ExecuteQueryAndWriteToFile connection, altIDQuery, altIDFileName
	ExecuteQueryAndWriteToFile connection, stockInventoryQuery, stockInventoryFileName

	' Close the connection
	connection.Close	
End If

logFileObj.WriteLine Now & " - Script execution completed"
logFileObj.Close
Set logFileObj = Nothing
'Decalared we finished as expected
Wscript.Echo "Done"

