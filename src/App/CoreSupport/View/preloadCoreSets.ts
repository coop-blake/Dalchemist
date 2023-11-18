import { contextBridge, ipcRenderer, IpcRendererEvent } from "electron";

export type Channels = "coreSets";

type Message = string;

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    coreSets: CoreSetsHandler;
  }
}

const coresetsHandler = {
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

contextBridge.exposeInMainWorld("coreSets", coresetsHandler);

export type CoreSetsHandler = typeof coresetsHandler;
