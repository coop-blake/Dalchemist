import DalchemistApp from "../DalchemistApp";

export const sendMainWindowStatus = async () => {
  await DalchemistApp.awaitOnReady();
  const mainWindow = DalchemistApp.getInstance().getMainWindow();
  mainWindow?.webContents.send("status", DalchemistApp.state.getStatus());
};
