import { Tree } from '@angular-devkit/schematics';
import { NodeDependency } from '../interfaces';
import { NodeDependencyType, pkgJson } from '../enums';
import { JSONFile } from './jsonFile';
import { findNodeAtLocation } from 'jsonc-parser';
import {appendPropertyInAstObject, insertPropertyInAstObjectInOrder} from './json-utils';

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
    const depsNode = packageJson.get([depType]);
    if (depsNode  && depsNode.type === 'object') {
      const depNode = findNodeAtLocation(depsNode, [name])
      if (depNode && depNode.type === 'string') {
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
  const depsNode = packageJsonAst.get([dependency.type]);
  const recorder = tree.beginUpdate(pkgJson.Path);

  try {
    if (!depsNode) {
      // Haven't found the dependencies key, add it to the root of the package.json.
      appendPropertyInAstObject(
        recorder,
        packageJsonAst.JsonAst,
        dependency.type,
        {
          [dependency.name]: dependency.version,
        },
        4
      );
    } else if ( depsNode && depsNode.type  === 'object') {
      // check if package already added
      const depNode = findNodeAtLocation(depsNode, [dependency.name]);

      if (!depNode) {
        // Package not found, add it.
        insertPropertyInAstObjectInOrder(recorder, depsNode, dependency.name, dependency.version, 4);
      } else if (dependency.overwrite) {
        // Package found, update version if overwrite.
        // const { end, start } = depNode;
        if(depNode.colonOffset === undefined) {
          throw new Error('Invalid package.json. Was expecting an object');
        } 
        
        recorder.remove(depNode.offset + depNode.colonOffset, depNode.offset + depNode.length );
        recorder.insertRight(depNode.offset + depNode.colonOffset, JSON.stringify(dependency.version));
      }
    }
  } catch (e) {
    console.log(e);
  }

  tree.commitUpdate(recorder);
}

export function removePackageJsonDependency(tree: Tree, dependency: NodeDependency): void {
  const packageJsonAst = new JSONFile(tree, pkgJson.Path);
  const depsNode = packageJsonAst.get([dependency.type]);
  const recorder = tree.beginUpdate(pkgJson.Path);

  if (!depsNode || !depsNode.children) {
    return;
  } 

  const depNode = findNodeAtLocation(depsNode, [dependency.name])?.parent;
  if (!depNode) return;
  
  let start = depNode.offset, length = depNode.length;
  
  let pos = depsNode.children.indexOf(depNode);
  // Previous property present
  if (pos -1 > -1) {
    const prevNode = depsNode.children[pos - 1];
    start = prevNode.offset + prevNode.length + 1;
    length = depNode.offset + depNode.length - start;
  }
  
  // Next property present
  if (pos < depsNode.children.length - 1) {
    length ++; // remove comma
  }

  recorder.remove(start, length);
  tree.commitUpdate(recorder);
}