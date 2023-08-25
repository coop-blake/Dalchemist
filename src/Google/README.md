# Google Updater

## Configuration
This folder holds the Google Updater which takes some configuration to use

You will need a [Google service account](https://cloud.google.com/iam/docs/service-account-overview) to use the Google API

[Create a service account](https://support.google.com/a/answer/7378726?hl=en) and save the authentication creditials in the JSON format in the 📁Data/Inputs/Inventory/googleCert.json

The service account will need access to the Google Sheets API and permision to edit the sheet specified in update.ts

[Info on enabling/disabling Google APIs for accounts](https://support.google.com/googleapi/answer/6158841?hl=en)



## Windows Task Scheduler Setup
After a successful Inventory Update, you can add it as a task to the Windows Task Scheduler at specified intervals.