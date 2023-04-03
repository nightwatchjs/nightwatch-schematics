import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import { expect } from 'chai';
import * as path from 'path';

const NUMBER_OF_SCAFFOLDED_FILES = 27;
const collectionPath = path.join(__dirname, '../src/schematics/collection.json');

describe('@nightwatch/schematics', async function () {
  async function getWorkspaceTree(appName = 'sandbox') {
    const ngRunner = new SchematicTestRunner('@schematics/angular', '');

    const workspaceOptions = {
      name: 'workspace',
      newProjectRoot: 'projects',
      version: '6.0.0',
    };

    const appOptions = {
      name: appName,
      inlineTemplate: false,
      routing: false,
      skipTests: false,
      skipPackageJson: false,
    };

    let appTree = await ngRunner.runSchematicAsync('workspace', workspaceOptions).toPromise();
    appTree = await ngRunner.runSchematicAsync('application', appOptions, appTree).toPromise();

    return appTree;
  }

  const runner: SchematicTestRunner = new SchematicTestRunner('schematics', collectionPath);

  it('Should throw if environment argument is missing', async function () {
    let errorMessage: any;
    try {
      await runner.runSchematicAsync('ng-add', {}, Tree.empty()).toPromise();
    } catch (error) {
      errorMessage = error.message;
    }
    expect(errorMessage).to.match(/required property 'environment'/);
  });

  it('should throw error if cucumberRunner argument is missing', async function () {
    let errorMessage: any;
    try {
      await runner
        .runSchematicAsync('ng-add', { environment: 'chrome' }, await getWorkspaceTree())
        .toPromise();
    } catch (error) {
      errorMessage = error.message;
    }
    expect(errorMessage).to.match(/required property 'cucumberRunner'/);
  });

  it('should add nightwatch config, and test cucumber as test runner is present in the nightwatch config', async function () {
    runner
      .runSchematicAsync(
        'ng-add',
        { environment: 'chrome', cucumberRunner: true },
        await getWorkspaceTree()
      )
      .toPromise()
      .then((tree) => {
        expect(tree.readContent('/projects/sandbox/nightwatch.conf.js')).to.match(
          /[a-zA-Z]+: 'cucumber'/
        );
      });
  });

  it('should add angular plugin to nightwatch config', async function () {
    runner
      .runSchematicAsync(
        'ng-add',
        { environment: 'chrome', componentTesting: true },
        await getWorkspaceTree()
      )
      .toPromise()
      .then((tree) => {
        expect(tree.readContent('/projects/sandbox/nightwatch.conf.js')).to.match(
          /[a-zA-Z]+: '@nightwatch\/angular'/
        );
      });
  });

  it('should add nightwatch config, and tests in workspace', async function () {
    runner
      .runSchematicAsync(
        'ng-add',
        { environment: 'chrome', cucumberRunner: false },
        await getWorkspaceTree()
      )
      .toPromise()
      .then((tree) => {
        expect(tree.exists('/nightwatch/tsconfig.e2e.json')).to.be.true;
        expect(tree.exists('/nightwatch/src/app_spec.ts')).to.be.true;
        expect(tree.exists('/nightwatch.conf.js')).to.be.true;
      });
  });

  it('should overwrite angular.json to include `nightwatch-run`', async function () {
    runner
      .runSchematicAsync(
        'ng-add',
        { environment: 'chrome', cucumberRunner: false },
        await getWorkspaceTree()
      )
      .toPromise()
      .then((tree) => {
        expect(tree.readContent('/angular.json')).to.contain(
          `"nightwatch-run": {
          "builder": "@nightwatch/schematics:nightwatch",
          "options": {
            "devServerTarget": "sandbox:serve",
            "tsConfig": "../nightwatch/tsconfig.e2e.json",
            "config": "./nightwatch.conf.js",
            "env": "chrome"
          },
          "configurations": {
            "production": {
              "devServerTarget": "sandbox:serve:production"
            }
          }
        }`
        );
      });
  });

  it('should add nightwatch in angular', async function () {
    runner
      .runSchematicAsync(
        'ng-add',
        { environment: 'chrome', cucumberRunner: false },
        await getWorkspaceTree()
      )
      .toPromise()
      .then((tree) => {
        expect(tree.files.length).to.equal(NUMBER_OF_SCAFFOLDED_FILES);
      });
  });
});
