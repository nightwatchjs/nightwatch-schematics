import {getPackageJsonDependency, addPackageJsonDependency, removePackageJsonDependency} from '../src/schematics/nightwatch/utility/dependencies';
import {expect} from 'chai'
import { NodeDependencyType } from '../src/schematics/nightwatch/enums';
import { UnitTestTree } from '@angular-devkit/schematics/testing';
import { HostTree } from '@angular-devkit/schematics';
import { virtualFs } from '@angular-devkit/core';

describe('test dependency manipulation functions', function() {
   
    it('should be able get package dependency', function() {

        let host = new virtualFs.test.TestHost({
            '/package.json': `{
                "name": "blah",
                "dependencies": {
                    "@angular/common": "^6.0.0"
                },

                "devDependencies": {
                    "typescript": "~4.2.3"
                }
            }`,
        });

        let tree = new UnitTestTree(new HostTree(host));
        
        const dependency = {
            type: 'dependencies',
            name: '@angular/common',
            version: '^6.0.0'
        };

        const result = getPackageJsonDependency(tree, dependency.name);
        expect(result).to.deep.equal(dependency);

        const devDependencie = {
            type: 'devDependencies',
            name: 'typescript',
            version: '~4.2.3'
        }

        const result2 = getPackageJsonDependency(tree, devDependencie.name);
        expect(result2).to.deep.equal(devDependencie);

        const notFound = getPackageJsonDependency(tree, 'notFound');
        expect(notFound).to.be.null;
    });

    it('should be able to append package dependency', async function() {

        let host = new virtualFs.test.TestHost({
            '/package.json': `
                {
                "name": "blah",
                "dependencies": {
                    "@angular-devkit-tests/update-base": "1.0.0"
                }
                }
            `,
        });
          
        let tree = new UnitTestTree(new HostTree(host));
        
        const dependency = {
            type: NodeDependencyType.Default,
            name: '@angular/core',
            version: '^6.0.0'
        };

        addPackageJsonDependency(tree, dependency);
        const result = getPackageJsonDependency(tree, dependency.name);
        expect(result).to.deep.equal(dependency);
    });

    it('should be able to add dev dependency to empty ', async function() {

        let host = new virtualFs.test.TestHost({
            '/package.json': `
                {
                "name": "blah",
                "dependencies": {
                    "@angular-devkit-tests/update-base": "1.0.0"
                }
                }
            `,
        });
          
        let tree = new UnitTestTree(new HostTree(host));
        
        const dependency = {
            type: NodeDependencyType.Dev,
            name: '@angular/core',
            version: '^6.0.0'
        };

        addPackageJsonDependency(tree, dependency);
        const result = getPackageJsonDependency(tree, dependency.name);
        expect(result).to.deep.equal(dependency);



        const dependency2 = {
            type: NodeDependencyType.Dev,
            name: '@angular/cli',
            version: '^6.0.0'
        };

        host = new virtualFs.test.TestHost({
            '/package.json': `
                {
                "name": "blah",
                "dependencies": {
                    "@angular-devkit-tests/update-base": "1.0.0"
                },
                "devDependencies": {}
                }`,
        });
          
        
        tree = new UnitTestTree(new HostTree(host));


        addPackageJsonDependency(tree, dependency);
        addPackageJsonDependency(tree, dependency2);
        const result2 = getPackageJsonDependency(tree, dependency.name);
        expect(result2).to.deep.equal(dependency);

        const result3 = getPackageJsonDependency(tree, dependency2.name);
        expect(result3).to.deep.equal(dependency2);

        host = new virtualFs.test.TestHost({
            '/package.json': `
                {

                }`,
        });
          
        tree = new UnitTestTree(new HostTree(host));
        

        addPackageJsonDependency(tree, dependency);
        const result4 = getPackageJsonDependency(tree, dependency.name);
        expect(result4).to.deep.equal(dependency);
    });

    it('should be able to remove dependencies', function() {
        let host = new virtualFs.test.TestHost({
            '/package.json': `
                {
                "name": "blah",
                "dependencies": {
                    "@angular/core": "^6.0.0",
                    "@angular-devkit-tests/update-base": "1.0.0"
                }
                }
            `,
        });
          
        let tree = new UnitTestTree(new HostTree(host));
        
        const dependency = {
            type: NodeDependencyType.Default,
            name: '@angular/core',
            version: '^6.0.0'
        };

        removePackageJsonDependency(tree, dependency);
        const result = getPackageJsonDependency(tree, dependency.name);
        expect(result).to.be.null;

        addPackageJsonDependency(tree, dependency);
        const result2 = getPackageJsonDependency(tree, dependency.name);
        expect(result2).to.deep.equal(dependency);
    });
});