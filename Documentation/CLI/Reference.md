# ![Icon](../resources/terminal.svg) Command Line Interface Reference

The following commands should be the first argument sent to the command line executable.  

# Dump DSN Query to Google Sheet

`dumpDSNToSheet <DSN> <sqlFile> <sheetID> <sheetRange> [googleCert]`

Executes an SQL query on the ODBC DSN and dumps the results to a Google Sheet using a service certifcate to authenticate.

- **DSN**: ODBC Data Source Name
- **sqlFile**: Path to the text file with the SQL query to be executed on the Data Source
- **sheetID**: The Google Sheet id used to dump the results of the SQL Query
- **sheetRange**: The range of the sheet to dump the results to
- **googleCert**: Path to the Google Service Certificate

