# Dalchemist

For assiting POS Tasks that rely on data from Catapult, UNFI, and NCG. This repository provides commands for building and packaging a desktop application for distribution. There are also commands that can be run from the command line or as automated tasks.

To run the npm commands below, you'll need [Node.js](https://nodejs.org/en/download/) installed on a host machine of your choosing.

You will also need access to a terminal. Terminal commands are represented like `this` in the documentation.

## ✨ Getting Started

### Download repository

With [git](https://git-scm.com/downloads) installed you can this command in the terminal to clone the repository.

`git clone https://github.com/coop-blake/Dalchemist.git`

You could also download a [Zip file from github](https://github.com/coop-blake/Dalchemist/archive/refs/heads/main.zip) or use [Github Desktop](https://desktop.github.com/)

### Install npm modules

Open a terminal in the 📁**Dalchemist** directory then use **Node Package Manager** to install the required package dependencies by entering

`npm install`

## ![Icon](./Documentation/resources/terminal.svg) Terminal Interface

Some commands are available from the terminal and can be executed without the graphical user interface.

### 🗒️ Generate File Outputs

Most of the terminal commands require configuration or data files placed in the [📁 Data](./Data) folder.

#### Place your Data files

Make sure you have the latest versions of your input data in the [📁 Data](./Data/Readme.md) folder

- Catapult Inventory and Price Worksheets
- Core Cost Support
- UNFI Pricebook and Pricechange

#### Generate Output

To generate all output to [**📁Data**](./Data) / [**📁Outputs**](./Data/Outputs) :

`npm run outputAll`

For other outputs see the [Outputs Documentation](./Documentation/Outputs.md)

## ![Icon](./icon/icon32.png) Run the Desktop App

The Desktop App is intended to provide a packaged, end user interface that can be downloaded, installed and used without any additional configuration or setup. Aside what is presented in the graphical interface.

Dalchemist uses the [Electron framework](https://www.electronjs.org/), which packages Dalchemist as a Desktop Application on variouse platforms. This repository provides commands to run and package the Desktop App. Some of this configuration was borrowed from the [Electron React Boilerplate](https://electron-react-boilerplate.js.org/) Thanks! 🙏

A google API service certificate is will need to be provided to load the data needed by the interface.

The desktop app can be transpiled and ran in development mode using the following command.

`npm run start:App`

You can also build a packaged Desktop App installer for Linux, Mac, or Windows.

`npm run package:App`

More details can be found in [📁 Documentation/](./Documentation)[📝 Application.md](./Documentation/Application.md)

## 🧑‍💻 Advanced usage and development

You are free to clone and develop this repoistory to fit your own needs.

[Visual Studio Code](https://code.visualstudio.com/Download) can be used to run and debug.  
Repository includes a [**.vscode/launch.json**](./.vscode/launch.json) configuration file.

Below are some commands to get get you started.

### Build the development documentation

`npm run docs`

### Run tests

`npm run test`

### Cleaning Generated Files

`npm run clean`

### Cleaning Generated Files and node_modules folder

`npm run clean:all`
