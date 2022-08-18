import { SchematicContext, Tree } from '@angular-devkit/schematics';
import { get } from 'https';
import { findNodeAtLocation } from 'jsonc-parser';
import { Config, pkgJson } from '../enums';
import { NodePackage } from '../interfaces';
import { getPackageJsonDependency } from './dependencies';
import {
  appendPropertyInAstObject,
  insertPropertyInAstObjectInOrder,
} from './json-utils';
import { JSONFile } from './jsonFile';

export function getAngularVersion(tree: Tree): number {
  const packageNode = getPackageJsonDependency(tree, '@angular/core');

  const version =
    packageNode &&
    packageNode.version
      .replace(/[~^]/, '')
      .split('.')
      .find((x) => !!parseInt(x, 10));

  return version ? +version : 0;
}

export function addPropertyToPackageJson(
  tree: Tree,
  context: SchematicContext,
  propertyName: string,
  propertyValue: { [key: string]: any }
) {
  const packageJsonAst = new JSONFile(tree, pkgJson.Path);
  const pkgNode = packageJsonAst.get([propertyName]);
  const recorder = tree.beginUpdate('package.json');

  if (!pkgNode) {
    // outer node missing, add key/value
    appendPropertyInAstObject(
      recorder,
      packageJsonAst.JsonAst,
      propertyName,
      propertyValue,
      Config.JsonIndentLevel
    );
  } else if (pkgNode.type === 'object') {
    // property exists, update values
    for (let [key, value] of Object.entries(propertyValue)) {
      const innerNode = findNodeAtLocation(pkgNode, [key]);

      if (!innerNode) {
        // script not found, add it
        context.logger.debug(`creating ${key} with ${value}`);

        insertPropertyInAstObjectInOrder(recorder, pkgNode, key, value, Config.JsonIndentLevel);
      } else {
        // script found, overwrite value
        context.logger.debug(`overwriting ${key} with ${value}`);


        recorder.remove(innerNode.offset, innerNode.offset + innerNode.length);
        recorder.insertRight(innerNode.offset, JSON.stringify(value));
      }
    }
  }

  tree.commitUpdate(recorder);
}

/**
 * Attempt to retrieve the latest package version from NPM
 * Return an optional "latest" version in case of error
 * @param packageName
 */
export function getLatestNodeVersion(packageName: string): Promise<NodePackage> {
  const DEFAULT_VERSION = 'latest';

  return new Promise((resolve) => {
    return get(`https://registry.npmjs.org/${packageName}`, (res) => {
      let rawData = '';
      res.on('data', (chunk) => (rawData += chunk));
      res.on('end', () => {
        try {
          const response = JSON.parse(rawData);
          const version = (response && response['dist-tags']) || {};

          if (packageName === 'nightwatch') {
            resolve(buildPackage(packageName, version.next));
          }
          resolve(buildPackage(packageName, version.latest));
        } catch (e) {
          resolve(buildPackage(packageName));
        }
      });
    }).on('error', () => resolve(buildPackage(packageName)));
  });

  function buildPackage(name: string, version: string = DEFAULT_VERSION): NodePackage {
    return { name, version };
  }
}
