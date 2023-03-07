export class Analytics {
  constructor(measurementId: string, apiSecret: string, options?: Options);
  track(eventName: string, params: {[string:any]: any}): Promise<void>;
  setUserId(userId: string): void;
}

export interface Options {
  debug?: boolean;
}
