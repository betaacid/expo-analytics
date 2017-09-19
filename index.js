import { Platform } from 'react-native';
import { Constants } from 'expo';

import GoogleAnalyticsProxy from './proxy';
import { ScreenHit, PageHit, Event } from './hits';

class Analytics {
    proxy = null
    queue = []

    constructor(propertyId, appId, appVersion){
        this.propertyId = propertyId;
        this.appId = appId;
        this.appVersion = appVersion;

        Constants.getWebViewUserAgentAsync()
        .then(userAgent => {
            this.userAgent = userAgent;
            this.proxy = new GoogleAnalyticsProxy(this.propertyId, Constants.deviceId, userAgent, this.appId, this.appVersion);
            // send anything that was added while we were getting the user agent
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

    flush(){
        if(this.proxy){
            while(this.queue.length){
                const hit = this.queue.pop();
                this.proxy.send(hit)
                .then(() => hit.sent = true);
            }
        }
    }
}

export { ScreenHit, PageHit, Event, Analytics };