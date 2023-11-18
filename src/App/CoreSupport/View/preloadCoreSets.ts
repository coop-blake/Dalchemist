import { contextBridge, ipcRenderer, IpcRendererEvent } from "electron";
import { CoreSupportPriceListEntry } from "../shared";

export type Channels =
  | "coreSetsWindowMessage"
  | "CoreSetAllDistributors"
  | "CoreSetAllEntriesUpdated"
  | "CoreSetSelectedDistributorsEntriesUpdated"
  | "CoreSetStatusUpdated"
  | "CoreSetFilePathUpdated"
  | "CoreSetReportEntries"
  | "CoreSetUserSelectedDistributors"
  | "setCoreSetsDistributors";

export type CoreSetMessage = string | string[] | CoreSupportPriceListEntry[];

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    coreSets: CoreSetsHandler;
  }
}

const coresetsHandler = {
  ipcRenderer: {
    sendMessage(channel: Channels, message: CoreSetMessage) {
      ipcRenderer.send(channel, message);
    },

    on<T>(channel: Channels, func: (message: T) => void) {
      const subscription = (_event: IpcRendererEvent, message: T) =>
        func(message);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },

    once(channel: Channels, func: (message: CoreSetMessage) => void) {
      ipcRenderer.once(channel, (_event, message) => func(message));
    },
  },
};

//type MessageCallback = (message: string) => void;

contextBridge.exposeInMainWorld("coreSets", coresetsHandler);

export type CoreSetsHandler = typeof coresetsHandler;
