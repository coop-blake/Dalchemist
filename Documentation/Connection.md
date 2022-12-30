# Connection
## Windows
A connection to the Catapult Database can be made with SQL Anywhere  
  
Run (Windows+R)
  * dbisql.exe
  * dbisql.com

Check connection/database from Powershell  
`dbinfo -c "Host=192.168.0.38;UserID=****;Password=****"`  
Replace **** with username and password

## Node.js 
[For connecting to SQL Anywhere with Node.js see this info from Microsoft:](https://learn.microsoft.com/en-us/sql/connect/node-js/step-3-proof-of-concept-connecting-to-sql-using-node-js?view=sql-server-ver16)  
They are recomending the [tedious](https://github.com/tediousjs/tedious) module  
Which contains more [examples](https://github.com/tediousjs/tedious/tree/master/examples)  

