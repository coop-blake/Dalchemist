import { contextBridge, ipcRenderer} from 'electron';




type MessageCallback = (message: string) => void;

contextBridge.exposeInMainWorld('receiveMessageFromMain', (callback: MessageCallback) => {
  ipcRenderer.on('message-from-main', (event, message) => {
    callback(message);
  });
});