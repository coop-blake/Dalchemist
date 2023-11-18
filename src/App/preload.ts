import { contextBridge, ipcRenderer, IpcRendererEvent } from "electron";

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    electron: ElectronHandler;
  }
}

export type Channels =
  | "status"
  | "error"
  | "mainWindowMessage"
  | "CoreSetEntriesUpdated"
  | "addDropWindowMessage"
  | "CoreSetStatusUpdated"
  | "PriceChangeWorksheetsStatus"
  | "PriceChangeWorksheetsFolderPath"
  | "coreSetsWindowMessage"
  | "setCoreSetsDistributors"
  | "CoreSetFilePathUpdated"
  | "inventoryData"
  | "inventoryDataLastReload";

const electronHandler = {
  ipcRenderer: {
    sendMessage(channel: Channels, message: string) {
      ipcRenderer.send(channel, message);
    },
    on(channel: Channels, func: (message: string) => void) {
      const subscription = (_event: IpcRendererEvent, message: string) =>
        func(message);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
  },
};

//type MessageCallback = (message: string) => void;

contextBridge.exposeInMainWorld("electron", electronHandler);

export type ElectronHandler = typeof electronHandler;
