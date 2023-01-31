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

  const NightwatchLauncher = path.join(process.cwd(), 'node_modules', '.bin', 'nightwatch');

  const nightwatchRunCommand = `${NightwatchLauncher} ${createNightwatchCommand(
    options,
    NightwatchCommandLineOptions
  )}`;

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
    console.log(`⚙️  Running ${command}`);

    try {
      const child = childProcess.spawnSync(`${command}`, [], { shell: true, encoding: 'utf-8' });
      context.logger.info(child.stdout);
      if (child.status === 0) {
        return resolve({ success: true });
      } else {
        console.error(child.stderr);
        resolve({ success: false });
      }
    } catch (error) {
      context.logger.error(error);
      reject();
    }
  });
}
