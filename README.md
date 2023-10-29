# Dalchemist

A collection of Typescript modules for assiting POS Tasks that rely on data from Catapult, UNFI, and NCG.

To run the npm commands below, you'll need [Node.js](https://nodejs.org/en/download/) installed on a host machine of your choosing.

You will also need access to a terminal. Terminal commands are represented like `this` in the documentation.

## ✨ Getting Started
### Download repository
You will need the Dalchemist repository on the host.  
With [git](https://git-scm.com/downloads) installed you can this command in the terminal to clone the repository.

`git clone https://github.com/coop-blake/Dalchemist.git`

You could also download a [Zip file from github](https://github.com/coop-blake/Dalchemist/archive/refs/heads/main.zip) or use [Github Desktop](https://desktop.github.com/)

### Install npm modules

Open a terminal in the 📁**Dalchemist** directory then use **Node Package Manager** to install the required package dependencies  

`npm install`


## ![Icon](./icon/icon32.png) Run the Desktop App  


`npm run startElectron`

More details can be found in [📁Documentation/](./Documentation)[📝Application.md](./Documentation/Application.md)




## 🗒️ Generate File Outputs 

### Place your Data files

Make sure you have the latest versions of your input data in the [Data](./Data/Readme.md) folder

- Catapult Inventory and Price Worksheets
- Core Cost Support
- UNFI Pricebook and Pricechange

To generate all output to [**📁Data**](./Data) / [**📁Outputs**](./Data/Outputs) :

`npm run outputAll`

For other outputs see the [Outputs Documentation](./Documentation/Outputs.md)

## 🌐 Access through a web browser

To start a [localhost web server on port 4848](http://localhost:4848/)

`npm run start`

This will start all Data Proccessors and Generators which can take a moment or two to initialize.

See the [Services Documentation](./Documentation/Services.md) for more specific options



## 🧑‍💻 Advanced usage and development

[Visual Studio Code](https://code.visualstudio.com/Download) can be used to run and debug the above commands and more.  
Configured in the [**.vscode/launch.json**](./.vscode/launch.json) configuration file.


### Build the development documentation

`npm run docs`

### Run tests

`npm run test`

### Cleaning Generated Files

`npm run clean`

### Cleaning Generated Files and node_modules folder

`npm run clean:all`
