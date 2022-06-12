import { Tree } from '@angular-devkit/schematics';
import { NodeDependency } from '../interfaces';
import {
  appendPropertyInAstObject,
  findPropertyInAstObject,
  insertPropertyInAstObjectInOrder,
} from './json-utils';
import { NodeDependencyType, pkgJson } from '../enums';
import { JSONFile } from './jsonFile';

export function getPackageJsonDependency(tree: Tree, name: string): NodeDependency | null {
  const packageJson = new JSONFile(tree, pkgJson.Path);
  let dep: NodeDependency | null = null;
  [
    NodeDependencyType.Default,
    NodeDependencyType.Dev,
    NodeDependencyType.Optional,
    NodeDependencyType.Peer,
  ].forEach((depType) => {
    if (dep !== null) {
      return;
    }
    const depsNode = findPropertyInAstObject(packageJson, depType);
    if (depsNode !== null && depsNode.kind === 'object') {
      const depNode = findPropertyInAstObject(depsNode, name);
      if (depNode !== null && depNode.kind === 'string') {
        const version = depNode.value;
        dep = {
          type: depType,
          name: name,
          version: version,
        };
      }
    }
  });

  return dep;
}

export function addPackageJsonDependency(tree: Tree, dependency: NodeDependency): void {
  const packageJsonAst = new JSONFile(tree, pkgJson.Path);
  const depsNode = findPropertyInAstObject(packageJsonAst, dependency.type);
  const recorder = tree.beginUpdate(pkgJson.Path);

  if (!depsNode) {
    // Haven't found the dependencies key, add it to the root of the package.json.
    appendPropertyInAstObject(
      recorder,
      packageJsonAst,
      dependency.type,
      {
        [dependency.name]: dependency.version,
      },
      4
    );
  } else if (depsNode.kind === 'object') {
    // check if package already added
    const depNode = findPropertyInAstObject(depsNode, dependency.name);

    if (!depNode) {
      // Package not found, add it.
      insertPropertyInAstObjectInOrder(recorder, depsNode, dependency.name, dependency.version, 4);
    } else if (dependency.overwrite) {
      // Package found, update version if overwrite.
      const { end, start } = depNode;
      recorder.remove(start.offset, end.offset - start.offset);
      recorder.insertRight(start.offset, JSON.stringify(dependency.version));
    }
  }

  tree.commitUpdate(recorder);
}
