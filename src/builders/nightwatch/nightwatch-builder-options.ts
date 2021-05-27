import { JsonObject } from '@angular-devkit/core';

interface SourceArray {
  [index: string]: string;
}

export interface NightwatchBuilderOption extends JsonObject {
  environment: string;
  config: string;
  source: SourceArray;
  devServerTarget: string;
}
