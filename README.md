# Dalchemist

A collection of Typescript modules for assiting POS Tasks that rely on data from Catapult, UNFI, and NCG.

You'll need [git](https://git-scm.com/downloads) and [Node.js](https://nodejs.org/en/download/) installed on a host machine of your choosing.

[Visual Studio Code](https://code.visualstudio.com/Download) and [Github Desktop](https://desktop.github.com/) are also recomended if you are using your workstation as the host.

You will also need access to a terminal and web browser. Terminal commands are represented like `this` in the documentation.

## Getting Started

You will need this repository on the machine you intend to use as a host. With git installed you can use the following terminal command to clone the repository into the current directory.

`git clone https://github.com/coop-blake/Dalchemist.git`

You could also download a [Zip file from github](https://github.com/coop-blake/Dalchemist/archive/refs/heads/main.zip) or use [Github Desktop](https://desktop.github.com/)

### Install npm modules

After _Changing Directories_ in your terminal  
 `cd Dalchamist`  
Use _Node Package Manager_ to install the packages required by Dalchamist  
`npm install`

### Place your Data files

Make sure you have the latest versions of your input data in the [Data](./Data/Readme.md) folder

- Catapult Inventory and Price Worksheets
- Core Cost Support
- UNFI Pricebook and Pricechange

## Generate File Outputs

To generate all output files to the 📁**Outputs** in 📁**Data** :

`npm run outputAll`

For other outputs see the [Outputs Documentation](./Documentation/Outputs.md)

## Access through a web browser

To start a [localhost web server on port 4848](http://localhost:4848/)

`npm run start`

This will start all Data Proccessors and Generators which can take a moment or two to initialize.

See the [Services Documentation](./Documentation/Services.md) for more specific options
