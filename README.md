[![npm version](https://badge.fury.io/js/expo-analytics.png)](https://badge.fury.io/js/expo-analytics)

Expo Analytics
=========

Google Analytics integration for use with React Native apps built on Expo.  Most of the other Google Analytics libraries I've found require linking, which is not supported with Expo.  This library does not require linking.

Please create issues for any bugs you find or features you would like added.

## Installation

```
npm install expo-analytics --save
```

## Usage

Your React Native app's screen resolution, app name, app ID, app version and multiple other parameters will be automatically resolved and sent with each hit or event.

Sending page hits or screen hits is done by constructing a new `PageHit` or `ScreenHit` instance and passing it to the `hit` function of an `Analytics` instance.

```
import { Analytics, PageHit } from 'expo-analytics';

const analyticsProxy = new Analytics('UA-XXXXXX-Y');
analyticsProxy.hit(new PageHit('Home'));
```

You can also optionally include any additional [supported parameters](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters) you would like.

```
import { Analytics } from 'expo-analytics';

// pass in the user ID (uid), referrer (dr) and campaign name (cn) 
const analyticsProxy = new Analytics('UA-XXXXXX-Y', { uid: '999', dr: 'github.com', cn: 'get_more_views' });
```

You can also send custom events by constructing a new `Event` instance and passing it to the `event` function.  Events have four parameters. 

* Event Category
* Event Action
* Event Label (optional, but recommended)
* Event Value (optional, integer)

These parameters are passed to the `Event` constructor in that order.  

```
import { Analytics, Event } from 'expo-analytics';

const analyticsProxy = new Analytics('UA-XXXXXX-Y');
analyticsProxy.event(new Event('Video', 'Play', 'The Big Lebowski', 123));
```

[Learn more](https://support.google.com/analytics/answer/1033068?hl=en) about custom events.

## Debugging

The Google Analytics API is a bit particular.  If you're not seeing Real Time hits in your Analytics console you can turn on debug mode for this package and the exact URL request being sent will be printed to the `console`.

```
import { Analytics, PageHit } from 'expo-analytics';

const analyticsProxy = new Analytics('UA-XXXXXX-Y', null, { debug: true });
analyticsProxy.hit(new PageHit('IsItWorking'));
``` 

## Release History

* 1.0.5 Fixing issue with duplicate dependencies causing installation problems.

* 1.0.4 Automatically pull screen resolution from React Native dimensions.  Resolve app name, app ID, app version from Expo manifest.  App name is now required.  Added debug option.

* 1.0.3 Added support for app ID and version

* 1.0.2 Added support for custom events

* 1.0.1 Initial release