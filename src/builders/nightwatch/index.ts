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
const Nightwatch = require('nightwatch');

export default createBuilder<NightwatchBuilderOption>(runNightwatch);

async function runNightwatch(
  options: NightwatchBuilderOption,
  context: BuilderContext
): Promise<any> {
  options.environment = options.environment || 'default';

  const NightWatchConfigPath = `${context.workspaceRoot}/nightwatch.conf.js`;
  const NightWatchConfig = require(NightWatchConfigPath);

  let result: BuilderOutput | undefined;

  interface argvType {
    _source?: string[];
    e?: string;
    env?: string;
    c?: string;
    config?: string;
    _: string[];
  }

  try {
    Nightwatch.cli(async function (argv: argvType) {
      argv._source = argv['_'].slice(0);

      argv.e = 'chrome';
      argv.env = 'chrome';
      argv.c = NightWatchConfigPath;
      argv.config = NightWatchConfigPath;
      argv._source = NightWatchConfig.src_folders;
      console.log(NightWatchConfig);
      console.log(NightWatchConfig.test_settings.chrome.webdriver);

      console.log(argv);

      const runner = Nightwatch.CliRunner(argv);

      try {
        await runner.setup().startWebDriver();
        result = runner.runTests().then(
          (exitCode: any) => ({
            success: exitCode === 0,
          }),
          (err: any) => ({
            error: err.message,
            success: false,
          })
        );
      } catch (error) {
        console.log(error);
      }
      await runner.stopWebDriver();
    });
  } catch (error) {
    console.log(error);

    result = {
      error: error.message,
      success: false,
    };
  } finally {
    return result;
  }
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
