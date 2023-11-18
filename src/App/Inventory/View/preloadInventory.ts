import { contextBridge, ipcRenderer, IpcRendererEvent } from "electron";
import { InventoryEntry } from "../../../Google/Inventory/shared";

export type Channels = "inventoryData" | "inventoryDataLastReload";

type Message = string | InventoryEntry[] | number;

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    inventory: InventoryHandler;
  }
}

const inventoryHandler = {
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

contextBridge.exposeInMainWorld("inventory", inventoryHandler);

export type InventoryHandler = typeof inventoryHandler;
