
export default class GoogleAnalyticsProxy {
    constructor(gaPropertyId, clientId, userAgent, appId, appVersion) {
        this.propertyId = gaPropertyId;
        this.clientId = clientId;
        this.userAgent = userAgent;
        this.appId = appId;
        this.appVersion = appVersion;
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
        * &z= cache buster (prevent browsers from caching GET requests -- should always be last)
        */

        const customDimensions = this.customDimensions.map(cd => `cd${cd.index}=${cd.value}`).join('&');

        const url = `https://www.google-analytics.com/collect?tid=${this.propertyId}&v=1&aid=${this.appId}&av=${this.appVersion}&cid=${this.clientId}&${hit.toQueryString()}&${customDimensions}&z=${Math.round(Math.random() * 1e8)}`;

        let options = {
            method: 'get',
            headers: {
                'User-Agent': this.userAgent
            }
        }

        return fetch(url, options);
    }
}