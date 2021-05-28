import {
  BuilderContext,
  BuilderOutput,
  createBuilder,
  scheduleTargetAndForget,
  targetFromTargetString,
} from '@angular-devkit/architect';
import { NightwatchBuilderOption } from './nightwatch-builder-options';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as path from 'path';
import * as childProcess from 'child_process';

export default createBuilder<NightwatchBuilderOption>(runNightwatch);

async function runNightwatch(
  options: NightwatchBuilderOption,
  context: BuilderContext
): Promise<any> {
  options.environment = options.environment || 'default';

  const NightWatchTestPath = `${context.workspaceRoot}/nightwatch`;
  const NightWatchConfigPath = `${context.workspaceRoot}/nightwatch.conf.js`;
  const NightwatchLauncher = path.join(process.cwd(), 'node_modules', '.bin', 'nightwatch');
  const compileCommand = `cd ${NightWatchTestPath}; tsc -p tsconfig.e2e.json;`;
  const nightwatchRunCommand = `${NightwatchLauncher} -e chrome -c ${NightWatchConfigPath};`;

  runCommand(compileCommand, context);
  return runCommand(nightwatchRunCommand, context);
}

export function startDevServer(
  devServerTarget: string,
  watch: boolean,
  context: BuilderContext
): Observable<string> {
  const overrides = {
    watch,
  };
  return scheduleTargetAndForget(context, targetFromTargetString(devServerTarget), overrides).pipe(
    map((output: any) => {
      if (!output.success && !watch) {
        throw new Error('Could not compile application files');
      }
      return output.baseUrl as string;
    })
  );
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
