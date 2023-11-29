import { contextBridge, ipcRenderer, IpcRendererEvent } from "electron";

import { AddDropStatus } from "../../../Google/addDrop/shared";

export type Channels =
  | "addDrop"
  | "newItemsArray"
  | "addDropDataLastReload"
  | "itemsAlreadyInInventory"
  | "itemsAlreadyInInventoryWithSupplierID"
  | "attributeChangeItems"
  | "priceUpdates"
  | "addDropWindowMessage"
  | "addDropStatus";

type Message = string | AddDropStatus;

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    addDrop: AddDropHandler;
  }
}

const addDropHandler = {
  ipcRenderer: {
    sendMessage(channel: Channels, message: Message) {
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

    once(channel: Channels, func: (message: Message) => void) {
      ipcRenderer.once(channel, (_event, message) => func(message));
    },
  },
};

//type MessageCallback = (message: string) => void;

contextBridge.exposeInMainWorld("addDrop", addDropHandler);

export type AddDropHandler = typeof addDropHandler;
