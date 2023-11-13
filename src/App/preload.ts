import { contextBridge, ipcRenderer, IpcRendererEvent } from "electron";

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    electron: ElectronHandler;
  }
}

export type Channels =
  | "status"
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
    sendMessage(channel: Channels, ...args: unknown[]) {
      ipcRenderer.send(channel, ...args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
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