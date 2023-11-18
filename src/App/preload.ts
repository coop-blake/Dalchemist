import { contextBridge, ipcRenderer, IpcRendererEvent } from "electron";

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    main: MainHandler;
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

type Message = string;

const mainHandler = {
  ipcRenderer: {
    sendMessage(channel: Channels, message: Message) {
      ipcRenderer.send(channel, message);
    },

    on(channel: Channels, func: (message: Message) => void) {
      const subscription = (_event: IpcRendererEvent, message: Message) =>
        func(message);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },

    once(channel: Channels, func: (message: Message) => void) {
      ipcRenderer.once(channel, (_event, message) => func(message));
    },
  },
};
//type MessageCallback = (message: string) => void;

contextBridge.exposeInMainWorld("main", mainHandler);

export type MainHandler = typeof mainHandler;
