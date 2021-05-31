import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import * as path from 'path';

const NUMBER_OF_SCAFFOLDED_FILES = 27;
const collectionPath = path.join(__dirname, '../collection.json');

describe('nightwatchjs-schematics', async () => {
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

  it('Should throw if environment argument is missing', async () => {
    let errorMessage: any;
    try {
      await runner.runSchematicAsync('ng-add', {}, Tree.empty()).toPromise();
    } catch (error) {
      errorMessage = error.message;
    }
    expect(errorMessage).toMatch(/required property 'environment'/);
  });

  it('should add nightwatch config, and tests in workspace', async () => {
    const tree = await runner
      .runSchematicAsync('ng-add', { environment: 'chrome' }, await getWorkspaceTree())
      .toPromise();

    expect(tree.files).toContain('/nightwatch/tsconfig.e2e.json');
    expect(tree.files).toContain('/nightwatch/src/app_spec.ts');
    expect(tree.files).toContain('/nightwatch.conf.js');
  });

  it('should overwrite angular.json to include `nightwatch-run`', async () => {
    const tree = await runner
      .runSchematicAsync('ng-add', { environment: 'chrome' }, await getWorkspaceTree())
      .toPromise();

    expect(tree.readContent('/angular.json')).toContain(
      `"nightwatch-run": {
          "builder": "nightwatchjs-schematics:nightwatch",
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

  it('should add nightwatch in angular', async () => {
    const tree = await runner
      .runSchematicAsync('ng-add', { environment: 'chrome' }, await getWorkspaceTree())
      .toPromise();

    expect(tree.files.length).toEqual(NUMBER_OF_SCAFFOLDED_FILES);
  });
});
