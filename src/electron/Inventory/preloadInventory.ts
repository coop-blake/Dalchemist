
import { contextBridge, ipcRenderer} from 'electron';




type MessageCallback = (message: string) => void;

contextBridge.exposeInMainWorld('receiveMessage', (callback: MessageCallback) => {
  ipcRenderer.on('message', (event, message) => {
    callback(message);
  });
});