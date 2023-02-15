
# NekoScript

Bot-Discord Script Runtime made in JavaScript

## What is it?
> This package is not affiliated with any of mentioned softwares, companies, nor community.

NekoScript is served as a JavaScript-made Runtime, allowing for the run of BotDesigner Script language behaviour ( known as BDScript ) made by [NilPointer Software](https://nilpointer.software/). Using `$` as a prefix to execute methods, the approach for creating such application is made simpler without much in depth of require for programming knowledge.

Another package named [Aoi.js](https://aoi.js.org/) has used of this idea to make somewhat simliar to be brought in NodeJS.

NekoScript has a different concept which are the use of package as a BDScript Runtime and focusing for compatibility. This package can be used in browser and other JavaScript runtime.

## Table of Contents
- [NekoScript](#nekoscript)
  - [What is it?](#what-is-it)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
    - [Browser](#browser)
    - [JavaScript Runtime](#javascript-runtime)
  - [API Usages](#api-usages)
    - [NekoRuntime](#nekoruntime)
    - [Using Components](#using-components)
    - [Running result](#running-result)
    - [Upcoming Features](#upcoming-features)
  - [Links](#links)

## Installation

### Browser
> Comming Soon for documented usage of example

### JavaScript Runtime
> The requirements for each listed JavaScript runtimes are:
> - **Node.js:** v14.x or above
> - **Deno.js:** v1.26 or above ( Requires NPM Support )
> - **Bun.js:** Requires Latest support ( Experimental )

NekoScript can be installed by downloading from a command-line as shown below
```bash
# In your Command Prompt ( can be a Terminal, Shell, or Console )
npm install nekoscript@latest

# Recommended for Bun.js users to use `bun install`
bun install nekoscript
```

## API Usages
### NekoRuntime
NekoRuntime is as-what it is named, its the runtime for running BDScript codes. An instance can be created as the usage shown below:

```ts
// ESM is supported
import nekoscript from 'nekoscript';

// or, as for Nodejs
const nekoscript = require("nekoscript");

// Creating a runtime from code input
const NekoRuntime = nekoscript.NekoRuntime
    .fromInput("myRuntime", "I am the result of code $log[I am logging this text]");
```

### Using Components
As for what methods is the runtime using... it does not have any command presets. **Component** does the job, these instances provides the runtime command methods and logics. We are using these `command methods` as shown before, the `$log` is one of the examples.

We also have provided some built-in presets components ready for use. These are the `Native Components` pre-bundled to the package:
- **StandardLibrary:** Known as `std`, a library for standard use such as debugging

One of them can be used like the example below:
```ts
// As a global component
NekoRuntime.Global
.add(new nekoscript.NativeComponents.StandardLibrary(), "std");

// or, as a local component
NekoRuntime.components
.add(new nekoscript.NativeComponents.StandardLibrary(), "std");

// Enabling components to runtime
// Same for local use
NekoRuntime.Global.using("std");
```

### Running result
Executing the runtime is the easiest of all procedures, its a one-liner like this:
```ts
NekoRuntime.run();

// or, you can log the output
console.log(NekoRuntime.run());
```

### Upcoming Features
> These features that are listed are not guaranteed and may change over time:
- **Promise-based system:** Allowing the use for async methods (as example: Fetching or Sending data, Downloading Files)
- **Discord Client Support:** Creating bot applications in Discord using NekoScript
- **Extended Native Components:** Enabling data storing capability by the use of List in code
- **NekoPocket Database:** A Database center, scaling horizontally using PocketBase as *the base*

## Links
- **Discord Server:** [Join here](https://discord.gg/pX3UhdPmQE "NekoScript Community Server")
- **Github Page:** [Visit github repo](https://github.com/Nekomoduler/nekoscript "Github Repository")
- **NPM Link:** [Visit npm repo](https://www.npmjs.com/package/nekoscript "NPM Repository Link")