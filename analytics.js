import { Platform, Dimensions } from 'react-native';
import Constants from 'expo-constants';

import { ScreenHit, PageHit, Event, Serializable } from './hits';

const { width, height } = Dimensions.get('window');

let defaultOptions = { debug: false };

let webViewUserAgent = null;
const getWebViewUserAgent = async (options) => {
    return new Promise((resolve) => {
        if (options.userAgent) {
            webViewUserAgent = options.userAgent;
            return resolve(options.userAgent);
        }
        if (webViewUserAgent) return resolve(webViewUserAgent);
        Constants.getWebViewUserAgentAsync()
          .then(userAgent => {
              webViewUserAgent = userAgent;
              resolve(userAgent);
          })
          .catch(() => resolve('unknown user agent'))
    });
}

export default class Analytics {
    customDimensions = []
    customMetrics = []

    constructor(propertyId, clientId, additionalParameters = {}, options = defaultOptions){
        this.propertyId = propertyId;
        this.options = options;
        this.clientId = clientId;
        this.parameters = {
            an: Constants.manifest.name,
            aid: Constants.manifest.slug,
            av: Constants.manifest.version,
            sr: `${width}x${height}`,
            ...additionalParameters
        };

        this.promiseGetWebViewUserAgentAsync = getWebViewUserAgent(options)
            .then(userAgent => {
                this.userAgent = userAgent;
                if(this.options.debug){
                    console.log(`[expo-analytics] UserAgent=${userAgent}`);
                    console.log(`[expo-analytics] Additional parameters=`, this.parameters);
                }
            });
    }

    hit(hit){
        // send only after the user agent is saved
        return this.promiseGetWebViewUserAgentAsync
            .then(() => this.send(hit));
    }

    event(event){
        // send only after the user agent is saved
        return this.promiseGetWebViewUserAgentAsync
            .then(() => this.send(event));
    }

    addParameter(name, value){
        this.parameters[name] = value;
    }

    addCustomDimension(index, value){
        this.customDimensions[index] = value;
    }

    removeCustomDimension(index){
        delete this.customDimensions[index];
    }

    addCustomMetric(index, value) {
        this.customMetrics[index] = value;
      }

    removeCustomMetric(index) {
        delete this.customMetrics[index];
    }

    send(hit) {
        /* format: https://www.google-analytics.com/collect? +
        * &tid= GA property ID (required)
        * &v= GA protocol version (always 1) (required)
        * &t= hit type (pageview / screenview)
        * &dp= page name (if hit type is pageview)
        * &cd= screen name (if hit type is screenview)
        * &cid= anonymous client ID (optional if uid is given)
        * &uid= user id (optional if cid is given)
        * &ua= user agent override
        * &an= app name (required for any of the other app parameters to work)
        * &aid= app id
        * &av= app version
        * &sr= screen resolution
        * &cd{n}= custom dimensions
        * &cm{n}= custom metrics
        * &z= cache buster (prevent browsers from caching GET requests -- should always be last)
        *
        * Ecommerce track support (transaction)
        * &ti= transaction The transaction ID. (e.g. 1234)
        * &ta= The store or affiliation from which this transaction occurred (e.g. Acme Clothing).
        * &tr= Specifies the total revenue or grand total associated with the transaction (e.g. 11.99). This value may include shipping, tax costs, or other adjustments to total revenue that you want to include as part of your revenue calculations.
        * &tt= Specifies the total shipping cost of the transaction. (e.g. 5)
        *
        * Ecommerce track support (addItem)
        * &ti= transaction The transaction ID. (e.g. 1234)
        * &in= The item name. (e.g. Fluffy Pink Bunnies)
        * &ip= The individual, unit, price for each item. (e.g. 11.99)
        * &iq= The number of units purchased in the transaction. If a non-integer value is passed into this field (e.g. 1.5), it will be rounded to the closest integer value.
        * &ic= TSpecifies the SKU or item code. (e.g. SKU47)
        * &iv= The category to which the item belongs (e.g. Party Toys)
        */

        const customDimensions = this.customDimensions.map((value, index) => `cd${index}=${value}`).join('&');
        const customMetrics = this.customMetrics.map((value, index) => `cm${index}=${value}`).join('&');

        const params = new Serializable(this.parameters).toQueryString();

        const url = `https://www.google-analytics.com/collect?tid=${this.propertyId}&v=1&cid=${this.clientId}&${hit.toQueryString()}&${params}&${customDimensions}&${customMetrics}&z=${Math.round(Math.random() * 1e8)}`;

        //Keep original options if on mobile
        let options = {
            method: 'get',
            headers: {
                'User-Agent': this.userAgent,
            }
        };

        if (Platform.OS === 'web') {
            //Request opaque resources to avoid preflight CORS error in Safari
            options.mode = 'no-cors';
        }

        if(this.options.debug){
            console.log(`[expo-analytics] Sending GET request to ${url}`);
        }

        return fetch(url, options);
    }

}
