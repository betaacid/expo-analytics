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
        const str = [];
        const obj = this.toObject();
        for (const p in obj) {
            if (obj.hasOwnProperty(p) && obj[p]) {
                str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
            }
        }
        return str.join('&');
    }
}

class Hit extends Serializable {
    
    sent = false

    constructor(props){
        super(props);
    }
}


export class PageHit extends Hit {
    constructor(screenName, screenTitle) {
        super({ dt: screenName, dp: screenTitle || screenName, t: 'pageview' });
    }
}

export class ScreenHit extends Hit {
    constructor(screenName) {
        super({ cd: screenName, t: 'screenview' });
    }
}

export class Event extends Hit {
    constructor(category, action, label, value) {
        super({ ec: category, ea: action, el: label, ev: value, t: 'event' });
    }
}

export class Transaction extends Hit {
    constructor(id, affiliation, revenue, shipping, tax) {
        super({ ti: id, ta: affiliation, tr: revenue, tt: tax, t: 'transaction' });
    }
}

export class AddItem extends Hit {
    constructor(id, name, price, quantity, sku, category) {
        super({ti: id, in: name, ip: price, iq: quantity, ic: sku, iv: category, t: 'item' });
    }
}
