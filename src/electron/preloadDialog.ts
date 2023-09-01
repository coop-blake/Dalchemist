

import { contextBridge, ipcRenderer} from 'electron';

//Commands to Be invoked by  renderer
contextBridge.exposeInMainWorld('commands', {
    searchInventory: (lookingFor: string) => 
    ipcRenderer.invoke('searchInventory', lookingFor)
    
  })