## ![Icon](./resources/terminal.svg) Command Line Interface

Some Dalchemist services can be packaged as an executable Command Line Interface program. This allows functionality to be transfered to other systems without having to install additional programs. These commands can then be ran from scripts, automated tasks, or from a terminal directly.

The commands provide the following functions:

- Checking Promos for pricing consitency
- Querying ODBC data source and uploading the result to a Google sheet

Because of the need for ODBC, the command line interface is currently only able to be built for windows environments.

### Running

You can run the command line interface from the terminal with `npm run start:cli`

### Building

The building scripts are used by the packaging process to transpile the Typescript into Javascript and can be ran with `npm run build:cli`

### Packaging

To package the Javascript into a CLI executable use `npm run package:cli`

The packaged installer can be found in [_/release/package/cli_ 📁](../release/package/cli/)

### Utilizing
You can run from the [_/release/package/cli_ 📁](../release/package/cli/) or copy the dalchemist.exe to another directory. For a list of commands see the [CLI Reference](./CLI/Reference.md)