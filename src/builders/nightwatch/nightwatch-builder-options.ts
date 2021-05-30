import { JsonObject } from '@angular-devkit/core';

export interface NightwatchBuilderOption extends JsonObject {
  env: string;
  config: string;
  test: string;
  testcase: string;
  group: string;
  skipgroup: string;
  filter: string;
  tag: string;
  skiptags: string;
  retries: number;
  suiteRetries: number;
  timeout: number;
  reporter: string;
  output: string;
  headless: boolean;
  verbose: boolean;
  tsConfig: string;
  devServerTarget: string;
}
