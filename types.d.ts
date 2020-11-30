export class Analytics {
  constructor(trackingId: string, parameters?: MeasurementParamter, options?: Options);
  hit(hitObject: PageHit | ScreenHit): Promise<void>;
  event(event: Event): Promise<void>;
  addCustomDimension(dimensionIndex: number, tag: string): void;
  addCustomMetric(metricIndex: number, tag: number): void;
  removeCustomDimension(dimensionIndex: number): void;
  removeCustomMetric(metricIndex: number): void;
}

export interface MeasurementParamter {
  uid?: string;
  dr?: string;
  cn?: string;

  // Support any other parameters available here:
  // https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters
  [key: string]: any;
}

export interface Options {
  debug?: boolean;
}

export class PageHit {
  constructor(screenName: string, screenTitle?: string);
}

export class ScreenHit {
  constructor(screenName: string);
}

export class Event {
  constructor(category: string, action: string, label?: string, value?: number);
}
