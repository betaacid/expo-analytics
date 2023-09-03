# No Longer Maintained
The original maintainers of this package no longer use Expo and are not interested in maintaining this project any longer. Feel free to fork it and use as you wish.


[![npm version](https://badge.fury.io/js/expo-analytics.png)](https://badge.fury.io/js/expo-analytics)

Expo Analytics
=========

Google Analytics integration for use with React Native apps built on Expo.  Most of the other Google Analytics libraries I've found require linking, which is not supported with Expo.  This library does not require linking.

Please create issues for any bugs you find or features you would like added.

## Installation

```
npm install expo-analytics --save
```

## Support for web + app projects
Selecting this option when creating a google analytics property the tracking ID it is not prefixed with `'UA-'` but with `G-` resulting in views not showing up. For now use the regular GA property pending resolving issue [#48](https://github.com/ryanvanderpol/expo-analytics/issues/48)

## Breaking Changes in Expo SDK 33

It seems that Expo introduced some breaking changes in SDK 33, so if you are using a version of Expo below 33 please pin your `package.json` to version `1.0.8` of this package.  `expo-analytics` `1.0.9+` is only compatable with Expo SDK 33+.

## Usage

Your React Native app's screen resolution, app name, app ID, app version and multiple other parameters will be automatically resolved and sent with each hit or event.

For SDK 44+ support you will need to provide the `clientId` in the form a UUID as `Constants.installationId` has been deprecated. You should generate and store this where appropriate for the platform and provide the value as the second argument.

##### Hits 

Sending page hits or screen hits is done by constructing a new `PageHit` or `ScreenHit` instance and passing it to the `hit` function of an `Analytics` instance.

```
import { Analytics, PageHit } from 'expo-analytics';

const analytics = new Analytics('UA-XXXXXX-Y', 'UUID');
analytics.hit(new PageHit('Home'))
  .then(() => console.log("success"))
  .catch(e => console.log(e.message));
```

##### Events

You can also send custom events by constructing a new `Event` instance and passing it to the `event` function.  Events have four parameters. 

* Event Category
* Event Action
* Event Label (optional, but recommended)
* Event Value (optional, integer)

These parameters are passed to the `Event` constructor in that order.  

```
import { Analytics, Event } from 'expo-analytics';

const analytics = new Analytics('UA-XXXXXX-Y', 'UUID');
analytics.event(new Event('Video', 'Play', 'The Big Lebowski', 123))
  .then(() => console.log("success"))
  .catch(e => console.log(e.message));
```

[Learn more](https://support.google.com/analytics/answer/1033068?hl=en) about custom events.

##### Custom Dimensions

[Custom Dimensions](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#cd_) are also supported.  Any custom dimensions set will be sent with each request.

```
import { Analytics, Event } from 'expo-analytics';

const analytics = new Analytics('UA-XXXXXX-Y', 'UUID');
analytics.addCustomDimension(1, 'TrialAccount');
analytics.addCustomDimension(2, 'Comedy');
analytics.event(new Event('Video', 'Play', 'The Big Lebowski', 123))
  .then(() => console.log("success"))
  .catch(e => console.log(e.message));
```

You can remove custom dimensions as needed.

```
analytics.removeCustomDimension(1);
```

##### Custom Metrics

[Custom Metrics](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#cm_) work the same way with just a slightly different call.

```
import { Analytics, Event } from 'expo-analytics';

const analytics = new Analytics('UA-XXXXXX-Y', 'UUID');
analytics.addCustomMetric(1, 15);
analytics.removeCustomMetric(1);
```

##### Additional Parameters

You can also optionally include any additional [supported parameters](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters) you would like.

```
import { Analytics } from 'expo-analytics';

// pass in the user ID (uid), referrer (dr) and campaign name (cn) 
const analytics = new Analytics('UA-XXXXXX-Y', 'UUID', { uid: '999', dr: 'github.com', cn: 'get_more_views' });
```

##### Ecommerce tracking 
###### Transaction hit type
You can also send purchase by constructing a new `Transaction` instance and passing it to the `transaction` function.  Transaction have five parameters. 

* id (Required, string)
* affiliation (Optional, string)
* revenue (Optional, currency, but recommended)
* shipping (Optional, currency)
* tax (Optional, currency)

These parameters are passed to the `Transaction` constructor in that order.

```
import { Analytics, Transaction } from 'expo-analytics';

const analytics = new Analytics('UA-XXXXXX-Y', 'UUID');

 analytics.hit(new Transaction('1235', 'Store', 38.43, 1.29, 5))
  .then(() => console.log("success"))
  .catch(e => console.log(e.message));
```

###### Item hit type
You can also send along the purchase the products that were purchased in the transaction, constructing a new `AddItem` instance and passing it to the `AddItem` function. 'AddItem' have six parameters. 

* id (The transaction id, Required, string)
* name (Required, string)
* price (Optional, currency, but recommended)
* quantity (Optional, integer)
* sku (Optional, string, but recommended)
* category (Optional, string, but recommended)

These parameters are passed to the `AddItem` constructor in that order.

```
import { Analytics, AddItem } from 'expo-analytics';

const analytics = new Analytics('UA-XXXXXX-Y', 'UUID');

 analytics.hit(new AddItem('1235', 'T-SHIRT', 11.99, 1, 'DD44', 'Clothes'))
  .then(() => console.log("success"))
  .catch(e => console.log(e.message));
```

## Debugging

The Google Analytics API is a bit particular.  If you're not seeing Real Time hits in your Analytics console you can turn on debug mode for this package and the exact URL request being sent will be printed to the `console`.

```
import { Analytics, PageHit } from 'expo-analytics';

const analytics = new Analytics('UA-XXXXXX-Y', 'UUID', null, { debug: true });
analytics.hit(new PageHit('IsItWorking'))
  .then(() => console.log("success"))
  .catch(e => console.log(e.message));
``` 

## More Options

You might want to use your own static userAgent http header instead of the default WebView header.
```
const analytics = new Analytics('UA-XXXXXX-Y', null, { userAgent: 'Custom UserAgent' });
```


## Release History

* 1.0.16 Using installationId instead of deviceId. Thanks @AlexKvazos! 👨🏻‍🎤

* 1.0.15 Fix for CORS issue in Safari when using with `expo-web`. Thanks @spencerlevitt and @chunghe!

* 1.0.14 Fixing a possible race condition. Thanks, @giautm!

* 1.0.13 User agent caching (thanks, @musemind!) and screenTitle on PageHits (thanks, @YassineElbouchaibi)

* 1.0.11 Support for e-commerce tracking.  Thanks, @lucianfialhobp.

* 1.0.10 Support for custom metrics.

* 1.0.9 Support for Expo 0.33.  Thanks, @rossb89.

* 1.0.8 Adding TypeScript definitions. 

* 1.0.7 Promisification.  Thanks, @dylancompanjen!

* 1.0.6 Fix for `ScreenHit` parameter name (thanks @davisml!).  Support for custom dimensions.

* 1.0.5 Fixing issue with duplicate dependencies causing installation problems.

* 1.0.4 Automatically pull screen resolution from React Native dimensions.  Resolve app name, app ID, app version from Expo manifest.  App name is now required.  Added debug option.

* 1.0.3 Added support for app ID and version

* 1.0.2 Added support for custom events

* 1.0.1 Initial release
