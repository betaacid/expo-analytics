import { Dimensions } from 'react-native';
import { Serializable } from './hits';


let defaultOptions = {
    debug: false
};

export default class GoogleAnalyticsProxy {
    constructor(gaPropertyId, clientId, userAgent, parameters = {}, options = defaultOptions) {
        this.propertyId = gaPropertyId;
        this.clientId = clientId;
        this.userAgent = userAgent;
        this.parameters = parameters;
        this.options = options;
        this.customDimensions = [];
    }

    addCustomDimension(index, value){
        this.customDimensions.push({ index, value });
    }

    send(hit) {
        /* format: https://www.google-analytics.com/collect? +
        * &tid= GA property ID (required)
        * &v= GA protocol version (always 1) (required)
        * &t= hit type (pageview / screenview)
        * &dp= page/screen name
        * &cid= anonymous client ID (optional if uid is given)
        * &uid= user id (optional if cid is given)
        * &ua= user agent override
        * &an= app name (required for any of the other app parameters to work)
        * &aid= app id
        * &av= app version
        * &sr= screen resolution
        * &cd{n}= custom dimensions
        * &z= cache buster (prevent browsers from caching GET requests -- should always be last)
        */

        const customDimensions = this.customDimensions.map(cd => `cd${cd.index}=${cd.value}`).join('&');

        const params = new Serializable(this.parameters).toQueryString();

        const url = `https://www.google-analytics.com/collect?tid=${this.propertyId}&v=1&cid=${this.clientId}&${hit.toQueryString()}&${params}&${customDimensions}&z=${Math.round(Math.random() * 1e8)}`;

        let options = {
            method: 'get',
            headers: {
                'User-Agent': this.userAgent
            }
        }

        if(this.options.debug){
            console.log(`[expo-analytics] Sending GET request to ${url}`);
        }

        return fetch(url, options);
    }
}