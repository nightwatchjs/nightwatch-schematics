# Nightwatch Angular Schematics

[![Node CI](https://github.com/nightwatchjs/nightwatch-schematics/actions/workflows/build.yml/badge.svg?branch=main)](https://github.com/nightwatchjs/nightwatch-schematics/actions/workflows/build.yml)


Add [Nightwatchjs](https://nightwatchjs.org/) to an Angular CLI Project.

This Schematic will:

- install Nightwatch,  it's dependencies and config files
- add necessary files for Nightwatch to work with Angular & Typescript
- prompt for removal of Protractor files and configuration

## Demo ✨
![Nightwatch Schematics Demo](https://raw.githubusercontent.com/nightwatchjs/nightwatch-schematics/main/.github/assets/nightwatch-schematics.gif)
## Usage 🚀

> ⚠️ **It's not released on NPM yet**

Run as one command in an Angular CLI app directory. Note this will add the schematic as a dependency to your project.

```bash
ng add @nightwatch/nightwatch-schematics
```

One can provide following options:
| Option    | Description                                                                                                                                                                                           |
|-----------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| noBuilder | This will skip the builder addition, leaving the angular.json file unmodified and requiring you to run Nightwatch from the command line or through your IDE. Include --noBuilder in your ng add command. |

<!-- ### Options: install globally

```bash
npm install -g @nightwatch/nightwatch-schematics
```

Then in an Angular CLI project run

```bash
ng g @nightwatch/nightwatch-schematics
``` -->
With the custom builder installed, you can run Nightwatch with the following commands:

```bash
ng e2e
```

```bash
ng run {your-project-name}:nightwatch-run
```

These two commands do the same thing. They will run nightwatch e2e tests.

One can also provide options to above commands as well:
| Name           | Default                | Description                                                                                                                                                                                                                                                      |
|----------------|------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| --env          | firefox                | Which testing environment to use - defined in nightwatch.json                                                                                                                                                                                                    |
| --config       | ./nightwatch.config.js | Path to configuration file; nightwatch.conf.js or nightwatch.json are read by default if present.                                                                                                                                                                |
| --test         |                        | Runs only the specified test suite/module. By default the runner will attempt to run all tests in the src_folders settings folder(s) and their subfolders.                                                                                                       |
| --testcase     |                        | Used only together with --test. Runs the specified test case from the current suite/module.                                                                                                                                                                      |
| --group        |                        | Runs only the specified group or several (comma separated) of tests (subfolder). Tests are grouped by being placed in the same subfolder.                                                                                                                        |
| --skipgroup    |                        | Skip one or several (comma separated) group of tests.                                                                                                                                                                                                            |
| --filter       |                        | Specify a filter (glob expression) as the file name format to use when loading the test files.                                                                                                                                                                   |
| --tag          |                        | Filter test modules by tags. Only tests that have the specified tags will be loaded.                                                                                                                                                                             |
| --skiptags     |                        | Skips tests that have the specified tag or tags (comma separated).                                                                                                                                                                                               |
| --retries      |                        | Retries failed or errored testcases up to the specified number of times. Retrying a testcase will also retry the beforeEach and afterEach hooks, if any.                                                                                                         |
| --suiteRetries |                        | Retries failed or errored testsuites (test modules) up to the specified number of times. Retrying a testsuite will also retry the before and after hooks (in addition to the global beforeEach and afterEach respectively), if any are defined on the testsuite. |
| --timeout      |                        | Set the global timeout for assertion retries before an assertion fails. The various timeout values are defined in the Globals section.                                                                                                                           |
| --reporter     |                        | Name of a predefined reporter (e.g. junit) or path to a custom reporter file to use.  The custom reporter interface looks like: ```module.exports = {write(results, options, done) {done();}};```                                            |
| --output       | tests_output           | The location where the JUnit XML reports will be saved.                                                                                                                                                                                                          |
| --headless     |                        | Launch the browser (Chrome or Firefox) in headless mode.                                                                                                                                                                                                         |
| --verbose      |                        | Shows extended selenium command logging during the session                                                                                                                                                                                                       |

## Issues 🐛

Issues with this schematic can filed [here](https://github.com/nightwatchjs/nightwatch-schematics/issues)

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

## E2E Testing 🧪

Execute the schematic against the sandbox. It will add Nightwatch config, tests, and custom builder, then run e2e tests in the sandbox.

```bash
npm run test
```

## Unit Testing 🧪

Run the unit tests using Jasmine as a runner and test framework

```bash
npm run build:test
npm run test:unit
```

## Reset the Sandbox ♻️

Running the schematic locally performs file system changes. The sandbox is version-controlled so that viewing a diff of the changes is trivial. After the schematic has run locally, reset the sandbox with the following.

```bash
npm run clean
```

---

These projects: [@briebug/cypress-schematic](https://github.com/briebug/cypress-schematic/), [schuchard/prettier-schematic](https://github.com/schuchard/prettier-schematic) helped us in development of this project. Thank you!
