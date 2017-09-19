Expo Analytics
=========

Google Analytics integration for use with React Native apps built on Expo.  Most of the other Google Analytics libraries I've found require linking, which is not supported with Expo.  This library does not require linking.

As of now, this is a pretty barebones implementation.  Please create issues for any features you would like added.

## Installation

```
npm install expo-analytics --save
```

## Usage

Sending page hits or screen hits is done by constructing a new `PageHit` or `ScreenHit` instance and passing it to the `hit` function of an `Analytics` instance.

```
import { Analytics, PageHit } from 'expo-analytics';

const analyticsProxy = new Analytics('UA-XXXXXX-Y');
analyticsProxy.hit(new PageHit('Home'));
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

## Release History

* 1.0.2 Added support for custom events

* 1.0.1 Initial release