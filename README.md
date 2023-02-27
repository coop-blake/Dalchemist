# Dalchemist

A collection of Typescript modules for assiting POS Tasks  

You'll need [Node.js](https://nodejs.org/en/download/) 

## Getting Started

Make sure you have the latest versions of your input data in the [Data](./Data/Readme.md) folder

### Clone this repository  
`git clone https://github.com/coop-blake/Dalchemist.git`  
You could also download a Zip file from github


### Install npm modules
Enter the repository directory and issue  
`npm install`


## Generate File Outputs

To generate all output files to Data/Outputs:  
`npm run outputAll`  

For other outputs see the [Outputs Documentation](./Documentation/Outputs.md)


## Access through a web browser

`npm run start`

This will start a [localhost web server on port 4848](http://localhost:4848/)

`npm run startPriceUpdate`

Starts the http server for a UNFI price update