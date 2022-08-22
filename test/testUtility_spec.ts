import { JsonObject, virtualFs } from "@angular-devkit/core";
import { Logger, LoggerApi, LogLevel } from "@angular-devkit/core/src/logger";
import { Engine, HostTree, MergeStrategy, Schematic, SchematicContext, TaskConfigurationGenerator, TaskId } from "@angular-devkit/schematics";
import { UnitTestTree } from "@angular-devkit/schematics/testing";
import { addPropertyToPackageJson } from "../src/schematics/nightwatch/utility/util";
import { findNodeAtLocation } from 'jsonc-parser';
import { JSONFile } from "../src/schematics/nightwatch/utility/jsonFile";
import { expect } from "chai";


class MockLogger implements LoggerApi {
    createChild(_name: string): Logger {
        throw new Error("Method not implemented.");
    }
    log(_level: LogLevel, message: string, _metadata?: JsonObject | undefined): void {
        console.log(message);
    }
    debug(_message: string, _metadata?: JsonObject | undefined): void {
        throw new Error("Method not implemented.");
    }
    info(_message: string, _metadata?: JsonObject | undefined): void {
        throw new Error("Method not implemented.");
    }
    warn(_message: string, _metadata?: JsonObject | undefined): void {
        throw new Error("Method not implemented.");
    }
    error(_message: string, _metadata?: JsonObject | undefined): void {
        throw new Error("Method not implemented.");
    }
    fatal(_message: string, _metadata?: JsonObject | undefined): void {
        throw new Error("Method not implemented.");
    }
}

class MockContext implements SchematicContext {
    debug: boolean;
    engine: Engine<{}, {}>;
    logger: MockLogger;
    schematic: Schematic<{}, {}>;
    strategy: MergeStrategy;
    interactive: boolean;
    addTask<T extends object>(_task: TaskConfigurationGenerator<T>, _dependencies?: TaskId[] | undefined): TaskId {
        throw new Error("Method not implemented.");
    }
    
}
describe('test utility functions', function() {

    it('should add entries to package.json', async function(){
        let host = new virtualFs.test.TestHost({
            '/package.json': `
{
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
  

        const scriptsToAdd = {
            'e2e:test': `./node_modules/.bin/nightwatch --env 'firefox' --config './nightwatch.conf.js'`
        }

        addPropertyToPackageJson(tree, new MockContext(), 'scripts', scriptsToAdd);

        const packageJson = new JSONFile(tree, '/package.json');
        const result = findNodeAtLocation(packageJson.JsonAst, ['scripts']);
        expect(result).not.to.be.undefined;
        
        if (result != undefined) {
            const result2 = findNodeAtLocation( result, ['e2e:test']);
            expect(result2?.value).to.equal(`./node_modules/.bin/nightwatch --env 'firefox' --config './nightwatch.conf.js'`);
        }
    });
});