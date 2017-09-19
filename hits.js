export class Serializable {

    constructor(props) {
        this.properties = props || {};
    }

    toObject() {
        return this.properties;
    }

    toString() {
        return JSON.stringify(this.toObject());
    }

    toJSON() {
        return JSON.stringify(this.properties);
    }

    toQueryString() {
        var str = [];
        var obj = this.toObject();
        for (var p in obj) {
            if (obj.hasOwnProperty(p) && obj[p]) {
                str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
            }
        }
        return str.join('&');
    }
}


export class PageHit extends Serializable {
    constructor(screenName) {
        super({ dp: screenName, t: 'pageview' });
    }
}

export class ScreenHit extends Serializable {
    constructor(screenName) {
        super({ dp: screenName, t: 'screenview' });
    }
}

export class Event extends Serializable {
    constructor(category, action, label, value) {
        super({ ec: category, ea: action, el: label, ev: value, t: 'event' });
    }
}