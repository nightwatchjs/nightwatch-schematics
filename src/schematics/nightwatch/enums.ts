export enum NodeDependencyType {
  Default = 'dependencies',
  Dev = 'devDependencies',
  Peer = 'peerDependencies',
  Optional = 'optionalDependencies',
}

export enum pkgJson {
  Path = '/package.json',
}

export enum Config {
  PackageJsonPath = 'package.json',
  JsonIndentLevel = 4,
}
