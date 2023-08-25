import * as Store from 'electron-store';
import { dialog } from "electron";
import Main from './electron-main'




class Settings {
  private static instance: Settings;
  private store: Store;

  private constructor() {
    this.store = new Store();
  }

  public static getInstance(): Settings {
    if (!Settings.instance) {
      Settings.instance = new Settings();
    }
    return Settings.instance;
  }

  public saveJsonLocation(location: string) {
    console.log(`Ready, going!!${location}`);

    this.store.set('jsonLocation', location);
  }

  public async  loadJsonLocation(): Promise<string | undefined> {

    let googleCertPath = this.store.get('jsonLocation') as string;
    if (googleCertPath) {
      console.log("googleCertPath", googleCertPath);
      return googleCertPath
    } else {
      console.log("No googleCertPath in settings!");

      if(Main.notReady){
        console.log("Not ready, waiting!");

      //  await Main.application?.on("ready", async () => {
      //     googleCertPath =  await openJsonFileDialog() as string
      //   });


        return new Promise<string | undefined>((resolve) => {
          Main.application?.on("ready", async () => {
            googleCertPath = await openJsonFileDialog() as string;
            this.saveJsonLocation(googleCertPath);
            resolve(googleCertPath);
          });
        });

        console.log("Not ready, waiting!");


      }else{
        console.log("Ready, going!!");

        googleCertPath =  await openJsonFileDialog() as string
      }
      this.saveJsonLocation(googleCertPath)
     return googleCertPath
    }
  }
}



async function openJsonFileDialog(): Promise<string | undefined> {
  console.log("openJsonFileDialog!");

  const result = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [{ name: 'JSON Files', extensions: ['json'] }],
  });
  console.log("openJsonFileDialog!",result);

  if (!result.canceled && result.filePaths.length > 0) {
    console.log("openJsonFileDialogreturngin!",result.filePaths[0]);

    return result.filePaths[0];
  }

  return undefined;
}

export default Settings;