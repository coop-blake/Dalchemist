'DatabaseUtility 
'Attempts to connect to datasource name
Function GetConnection(dataSourceName)
	set objConnection = CreateObject("ADODB.Connection")
	'Username and password should be set up in ODBC Data Sources
	connectionString = "DSN=" & dataSourceName & ";Uid=;Pwd;"
	objConnection.ConnectionString = connectionString

	'attempt connection
	on Error Resume Next
	objConnection.Open
	if Err.Number = 0 Then
		'connection success
		Wscript.Echo "Connection to '" & dataSourceName & "' was successful."
		'return connection object
		Set GetConnection = objConnection
	else
		'connection failure
		Wscript.Echo "Connection to '" & dataSourceName & "' failed. Error: " & Err.Description
		'return error string
		Set GetConnection = Nothing
	End If
	On Error GoTo 0
End Function

'Executes Query on Connection and saves result to textFileName
'Result is tab seperated and saved in fetches directory
Function ExecuteQueryAndWriteToFile(connection, query, textFileName)
'Create Record Set
Set recordSet = CreateObject("ADODB.Recordset")
recordSet.ActiveConnection = connection
recordSet.Source = query
recordSet.Open

' Create a file system object
Set objFSO = CreateObject("Scripting.FileSystemObject")
' Get the script directory path
scriptDirectory = objFSO.GetParentFolderName(WScript.ScriptFullName)
' Get the path to fetches folder in script directory
fetchesFolderPath = objFSO.BuildPath(scriptDirectory, "fetches")
' If the fetches folder path directory does not exist
If NOT (objFSO.FolderExists(fetchesFolderPath)) Then
' Create the ferches folder
 objFSO.CreateFolder(fetchesFolderPath)
End If

' Combine script directory path with the output file name
outputFilePath = objFSO.BuildPath(fetchesFolderPath, textFileName)

' Create the output text file
Set outputFile = objFSO.OpenTextFile(outputFilePath, 2, True,-1)

' Write column headers to the file
For i = 0 to recordSet.Fields.Count - 2
'For Each field In recordSet.Fields except the last
outputFile.Write "" & recordSet.Fields(i).Name & vbTab
Next
'Don't put a tab on the last one
outputFile.Write "" & recordSet.Fields(recordSet.Fields.Count - 1).Name
' add line delimination
outputFile.WriteLine
' Write data rows to the file
records = recordSet.Fields.Count
lastRecordIndex = records - 1
Do Until recordSet.EOF
	For i = 0 to records - 2
	'write the value and a tab for all but last value
       outputFile.Write "" & recordSet.Fields(i).Value & vbTab
    Next
	'just last value, no tab
	 outputFile.Write "" & recordSet.Fields(lastRecordIndex) 
	' add line delimination
    outputFile.WriteLine
    recordSet.MoveNext
Loop
' Close the output file
outputFile.Close
' Close the recordset
recordSet.Close

End Function
