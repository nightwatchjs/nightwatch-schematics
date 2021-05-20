import {
  apply,
  chain,
  mergeWith,
  move,
  Rule,
  SchematicContext,
  Tree,
  url,
} from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import { map, concatMap } from 'rxjs/operators';
import { Observable, of, concat } from 'rxjs';
import { NodeDependencyType } from './enums';
import { NodePackage, SchematicsOptions } from './interfaces';
import {
  getAngularVersion,
  getLatestNodeVersion,
  removePackageJsonDependency,
} from './utility/util';
import { addPackageJsonDependency } from './utility/dependencies';

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export default function (_options: SchematicsOptions): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    _options = { ..._options, __version__: getAngularVersion(tree) };

    return chain([updateDependencies(_options), addNightwatchJsConfigFile()]);
  };
}

function updateDependencies(options: any): Rule {
  let removeDependencies: Observable<Tree>;
  return (tree: Tree, context: SchematicContext): Observable<Tree> => {
    context.logger.debug('Updating dependencies...');
    context.addTask(new NodePackageInstallTask());

    if (options.removeProtractor) {
      removeDependencies = of('protractor').pipe(
        map((packageName: string) => {
          context.logger.debug(`Removing ${packageName} dependency`);

          removePackageJsonDependency(tree, {
            type: NodeDependencyType.Dev,
            name: packageName,
          });

          return tree;
        })
      );
    }

    const addDependencies = of('nightwatch').pipe(
      concatMap((packageName: string) => getLatestNodeVersion(packageName)),
      map((packageFromRegistry: NodePackage) => {
        const { name, version } = packageFromRegistry;
        context.logger.debug(`Adding ${name}:${version} to ${NodeDependencyType.Dev}`);

        addPackageJsonDependency(tree, {
          type: NodeDependencyType.Dev,
          name,
          version,
        });

        return tree;
      })
    );

    if (options.removeProtractor) {
      return concat(removeDependencies, addDependencies);
    }
    return concat(addDependencies);
  };
}

function addNightwatchJsConfigFile(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    context.logger.debug('adding Nightwatchjs config file to host dir');

    return chain([mergeWith(apply(url('./files'), [move('./')]))])(tree, context);
  };
}
