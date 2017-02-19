import events from 'events';

class Element extends events.EventEmitter {
    constructor() {
        super();
    }
}

export default function mockEventedDomElement() {
    const element = new Element();
    element.addEventListener = element.addListener;
    element.removeEventListener = element.removeListener;
    element.dispatchEvent = function(e) {
        return element.emit(e.type, e);
    };

    return element;
}