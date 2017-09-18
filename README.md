Expo Analytics
=========

Google Analytics integration for use with React Native apps built on Expo.  Most of the other Google Analytics libraries I've found require linking, which is not supported with Expo.  This library does not require linking.

As of now, this is a pretty barebones implementation.  Please create issues for any features you would like added.

## Installation

``` shell
  npm install expo-analytics --save
```

## Usage

``` js
import { Analytics, PageHit } from 'expo-analytics';

const analyticsProxy = new Analytics('UA-XXXXXX-Y');
analyticsProxy.hit(new PageHit('Home'));
```


## Release History

* 1.0.1 Initial release