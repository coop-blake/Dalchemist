import { Menu, MenuItemConstructorOptions } from "electron";
import DalchemistApp from "../DalchemistApp";

export const createAndSetApplicationMenu = async () => {
  await DalchemistApp.awaitOnReady();

  // Build the default menu
  //const defaultMenu = Menu.buildFromTemplate([]);
  const defaultMenu = Menu.getApplicationMenu();

  const appMenu = defaultMenu?.items.find((item) => {
    (item.role as string).valueOf() === ("appmenu" as string).valueOf()
      ? item
      : null;
  });

  const applicationMenuTemplate: MenuItemConstructorOptions[] = [
    {
      label: "My App",
      submenu: [
        {
          label: "About My App",
          click: () => {
            // Open a custom about window here
          }
        },
        {
          type: "separator"
        },
        {
          role: "quit"
        }
      ]
    },
    {
      label: "Edit",
      submenu: [
        // Add custom Edit menu items here
      ]
    }
    // Add other menu items and submenus as needed
  ];

  const defaultItemsToRetain = ["appmenu", "filemenu", "cut", "copy", "paste"];

  const filteredDefaultMenu =
    defaultMenu?.items.filter((item) => {
      if (item.role && defaultItemsToRetain.includes(item.role as string)) {
        return true;
      }
      return false;
    }) || [];

  const template: MenuItemConstructorOptions[] = [
    ...applicationMenuTemplate,
    ...(appMenu ? [appMenu] : [])
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
};
