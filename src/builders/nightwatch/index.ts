import { BuilderContext, BuilderOutput, createBuilder } from '@angular-devkit/architect';
import { NightwatchBuilderOption } from './nightwatch-builder-options';
import * as path from 'path';
import * as childProcess from 'child_process';

export default createBuilder<NightwatchBuilderOption>(runNightwatch);

async function runNightwatch(
  options: NightwatchBuilderOption,
  context: BuilderContext
): Promise<any> {
  const NightwatchCommandLineOptions: string[] = [
    'env',
    'config',
    'test',
    'testcase',
    'group',
    'skipgroup',
    'filter',
    'tag',
    'skiptags',
    'retries',
    'suiteRetries',
    'timeout',
    'reporter',
    'output',
    'headless',
    'verbose',
  ];

  const NightWatchTestPath = `${context.workspaceRoot}/nightwatch`;
  const NightwatchLauncher = path.join(process.cwd(), 'node_modules', '.bin', 'nightwatch');
  const compileCommand = `cd ${NightWatchTestPath}; tsc -p ${options.tsConfig};`;

  const nightwatchRunCommand = `${NightwatchLauncher} ${createNightwatchCommand(
    options,
    NightwatchCommandLineOptions
  )}`;

  runCommand(compileCommand, context);
  return runCommand(nightwatchRunCommand, context);
}

function createNightwatchCommand(options: any, nightwatchCommandLIneOptions: string[]): string {
  let command = '';
  nightwatchCommandLIneOptions.forEach((nightwatchOption, index) => {
    if (options[nightwatchOption] !== undefined) {
      if (typeof options[nightwatchOption] === 'boolean') {
        if (options[nightwatchOption] === true) {
          command += `${index === 0 ? '' : ' '}--${nightwatchOption}`;
        }
      } else {
        command += `${index === 0 ? '' : ' '}--${nightwatchOption} "${options[nightwatchOption]}"`;
      }
    }
  });
  return command;
}

function runCommand(command: string, context: BuilderContext): Promise<BuilderOutput> {
  return new Promise<BuilderOutput>((resolve, reject) => {
    context.reportStatus(`Running ${command} ...`);

    try {
      const child = childProcess.spawnSync(`${command}`, [], { shell: true, encoding: 'utf-8' });
      context.logger.info(child.stdout);
      if (child.status === 0) {
        return resolve({ success: true });
      } else {
        resolve({ success: false });
      }
    } catch (error) {
      context.logger.error(error);
      reject();
    }
  });
}