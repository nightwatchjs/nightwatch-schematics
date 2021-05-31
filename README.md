# Nightwatch Angular Schematics

Add [Nightwatchjs](https://nightwatchjs.org/) to an Angular CLI Project.

This Schematic will:

- install Nightwatch,  it's dependencies and config files
- add necessary files for Nightwatch to work with Angular & Typescript
- prompt for removal of Protractor files and configuration


## Usage 🚀

> ⚠️ **It's not released on NPM yet**

Run as one command in an Angular CLI app directory. Note this will add the schematic as a dependency to your project.

```bash
ng add @nightwatch/nightwatch-schematics
```

One can provide following options:
| Option    | Description                                                                                                                                                                                           |
|-----------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| noBuilder | This will skip the builder addition, leaving the angular.json file unmodified and requiring you to run Cypress from the command line or through your IDE. Include --noBuilder in your ng add command. |

<!-- ### Options: install globally

```bash
npm install -g @nightwatch/nightwatch-schematics
```

Then in an Angular CLI project run

```bash
ng g @nightwatch/nightwatch-schematics
``` -->
With the custom builder installed, you can run cypress with the following commands:

```bash
ng e2e
```

```bash
ng run {your-project-name}:nightwatch-run
```

These two commands do the same thing. They will run nightwatch e2e tests.

## Issues 🐛

Issues with this schematic can filed [here](https://github.com/nightwatch/nightwatch-schematics/issues)

If you want to contribute (or have contributed in the past), feel free to add yourself to the list of contributors in the package.json before you open a PR!

## Development 👩🏽‍💻

### Getting Started

🛠️ [Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) are required for the scripts. Make sure it's installed on your machine.

⬇️ **Install** the dependencies for the schematic and the sandbox application

```bash
npm i && cd sandbox && npm i && cd ..
```

🖇 **Link** the schematic in the sandbox to run locally

```bash
npm run link:sandbox
```

🏃 **Run** the schematic

```bash
npm run build:clean:launch
```

## E2E Testing

Execute the schematic against the sandbox. It will add Nightwatch config, tests, and custom builder, then run e2e tests in the sandbox.

```bash
npm run test
```

## Unit Testing

Run the unit tests using Jasmine as a runner and test framework

```bash
npm run build:test
npm run test:unit
```

## Rest the Sandbox

Running the schematic locally performs file system changes. The sandbox is version-controlled so that viewing a diff of the changes is trivial. After the schematic has run locally, reset the sandbox with the following.

```bash
npm run clean
```

That's it!
