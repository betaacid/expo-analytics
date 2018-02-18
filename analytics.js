import { Platform, Dimensions } from 'react-native';
import { Constants } from 'expo';

import { ScreenHit, PageHit, Event, Serializable } from './hits';

const { width, height } = Dimensions.get('window');

let defaultOptions = { debug: false };

export default class Analytics {
    ready = false
    queue = []
    customDimensions = []

    constructor(propertyId, additionalParameters = {}, options = defaultOptions){
        this.propertyId = propertyId;
        this.options = options;
        this.clientId = Constants.deviceId;

        Constants.getWebViewUserAgentAsync()
        .then(userAgent => {
            this.userAgent = userAgent;
            
            this.parameters = { 
                an: Constants.manifest.name, 
                aid: Constants.manifest.slug, 
                av: Constants.manifest.version,
                sr: `${width}x${height}`,
                ...additionalParameters
            };

            if(this.options.debug){
                console.log(`[expo-analytics] UserAgent=${userAgent}`);
                console.log(`[expo-analytics] Additional parameters=`, this.parameters);
            }

            // send anything that was added while we were getting the user agent
            this.ready = true;
            this.flush();
        });
    }

    hit(hit){
        this.queue.push(hit);
        this.flush();
    }

    event(event){
        this.queue.push(event);
        this.flush();
    }

    addCustomDimension(index, value){
        this.customDimensions[index] = value;
    }

    removeCustomDimension(index){
        delete this.customDimensions[index];
    }

    flush(){
        if(this.ready){
            while(this.queue.length){
                const hit = this.queue.pop();
                this.send(hit)
                .then(() => hit.sent = true);
            }
        }
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
        * &z= cache buster (prevent browsers from caching GET requests -- should always be last)
        */

        const customDimensions = this.customDimensions.map((value, index) => `cd${index}=${value}`).join('&');

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
