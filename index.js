import { Platform } from 'react-native';
import { Constants } from 'expo';

import GoogleAnalyticsProxy from './proxy';
import { ScreenHit, PageHit } from './hit';

class Analytics {
    proxy = null
    hitQueue = []

    constructor(propertyId){
        this.propertyId = propertyId;

        Constants.getWebViewUserAgentAsync()
        .then(userAgent => {
            this.userAgent = userAgent;
            this.proxy = new GoogleAnalyticsProxy(this.propertyId, Constants.deviceId, userAgent);
            // send anything that was added while we were getting the user agent
            this.flush();
        });
    }

    hit(hit){
        this.hitQueue.push(hit);
        this.flush();
    }

    flush(){
        if(this.proxy){
            while(this.hitQueue.length){
                const hit = this.hitQueue.pop();
                this.proxy.send(hit);
            }
        }
    }
}

export { ScreenHit, PageHit, Analytics };