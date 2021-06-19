import { SchematicsException, Tree } from '@angular-devkit/schematics';

export const ANGULAR = 'angular';
export const REACT = 'react';
export const REACT_TS = 'react-ts';
export const REACT_NATIVE = 'react-native';
export const TYPESCRIPT = 'typescript';

export default function getFramework(host: Tree) {
  let possibleFiles = ['/package.json'];

  const filePath = possibleFiles.filter((path) => host.exists(path))[0];
  const configBuffer = host.read(filePath);
  if (configBuffer === null) {
    throw new SchematicsException(`couldn't find ${filePath}`);
  } else {
    const content = JSON.parse(configBuffer.toString());
    if (content.dependencies['@angular/core']) {
      return ANGULAR;
    } else if (content.dependencies['react']) {
      if (content.dependencies['react-native']) {
        return REACT_NATIVE;
      }
      if (content.dependencies['typescript']) {
        return REACT_TS;
      }
      return REACT;
    } else if (content.dependencies['typescript'] && !content.dependencies['react']) {
      return TYPESCRIPT;
    } else {
      throw new SchematicsException('No supported frameworks found in your package.json!');
    }
  }
}
