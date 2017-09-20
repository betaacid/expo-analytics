import { Platform, Dimensions } from 'react-native';
import { Constants } from 'expo';

import GoogleAnalyticsProxy from './proxy';
import { ScreenHit, PageHit, Event } from './hits';

const { width, height } = Dimensions.get('window');

export default class Analytics {
    proxy = null
    queue = []

    constructor(propertyId, additionalParameters = {}, proxyOptions = {}){
        this.propertyId = propertyId;

        Constants.getWebViewUserAgentAsync()
        .then(userAgent => {
            this.userAgent = userAgent;
            
            const params = { 
                an: Constants.manifest.name, 
                aid: Constants.manifest.slug, 
                av: Constants.manifest.version,
                sr: `${width}x${height}`,
                ...additionalParameters
            };

            if(proxyOptions.debug){
                console.log(`[expo-analytics] UserAgent=${userAgent}`);
                console.log(`[expo-analytics] Additional parameters=`, params);
            }

            this.proxy = new GoogleAnalyticsProxy(this.propertyId, Constants.deviceId, userAgent, params, proxyOptions);
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