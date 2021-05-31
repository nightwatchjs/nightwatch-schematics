# Nightwatch Angular Schematics

Add [Nightwatchjs](https://nightwatchjs.org/) to an Angular CLI Project.

This Schematic will:

- install Nightwatch,  it's dependencies and config files
- add necessary files for Nightwatch to work with Angular & Typescript
- prompt for removal of Protractor files and configuration


### Testing

To test locally, install `@angular-devkit/schematics-cli` globally and use the `schematics` command line tool. That tool acts the same as the `generate` command of the Angular CLI, but also has a debug mode.

Check the documentation with

```bash
schematics --help
```

### Unit Testing

`npm run test` will run the unit tests, using Jasmine as a runner and test framework.

### Publishing

To publish, simply do:

```bash
npm run build
npm publish
```

That's it!
