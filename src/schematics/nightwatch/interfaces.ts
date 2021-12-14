import { NodeDependencyType } from './enums';

export interface SchematicsOptions {
  removeProtractor: string;
  environment: string;
  noBuilder: string;
  cucumberRunner: string;
  __version__: number;
}

export interface NodeDependency {
  type: NodeDependencyType;
  name: string;
  version: string;
  overwrite?: boolean;
}

export interface NodePackage {
  name: string;
  version: string;
}

export interface DeleteNodeDependency {
  type: NodeDependencyType;
  name: string;
}

export interface ScriptHash {
  [command: string]: string;
}
