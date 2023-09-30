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
priceChangeItemsQuery = "SELECT " & _
    "TRIM(SI.INV_ScanCode) AS ScanCode," & _ 
    "TRIM(PCD_Price_pl1) AS Price, " & _
    "TRIM(DP.DIS_Description) AS Discount," & _
	"TRIM(PCD_WRKName) AS Worksheet, " & _
    "TRIM(PCD_PSWStartDate) AS StartDate, " & _
	"TRIM(PCD_PSWEndDate) AS EndDate " & _
"FROM PriceChangeData " & _
"LEFT JOIN   DiscountProfiles DP ON PCD_DIS_FK_pl1 = DP.DIS_PK AND PCD_DIS_CFK_pl1 = DP.DIS_CPK " & _
"LEFT JOIN   StockInventory SI ON PCD_INV_FK = SI.INV_PK AND PCD_INV_CFK = SI.INV_CPK " & _
"WHERE PCD_PSWEndDate > NOW();"

priceChangeItemsFileName = "PriceChangeData.txt"

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
	ExecuteQueryAndWriteToFile connection, priceChangeItemsQuery, priceChangeItemsFileName

	' Close the connection
	connection.Close	
End If

logFileObj.WriteLine Now & " - Script execution completed"
logFileObj.Close
Set logFileObj = Nothing
'Decalared we finished as expected
Wscript.Echo "Done"

