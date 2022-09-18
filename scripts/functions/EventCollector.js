class EventCollector {
    constructor() {
        this.events = {};
        this.collect = this.collect.bind(this);
    }

    add(event) {
        window.addEventListener(event.type, event.listener);
        this.collect(event);
    }

    remove(eventId) {
        let event;

        Object.keys(this.events).forEach((id, index) => {
            if(eventId === id) event = Object.values(this.events)[index];
        });

        if(event) window.removeEventListener(event.type, event.listener);
    }
    
    collect(event) {
        let eventObject;

        Object.keys(event).forEach((key, index) => {
            if(key === "id") return;
            eventObject = {...eventObject, [key]: Object.values(event)[index]};
        });

        this.events = {...this.events, [event.id]: eventObject};
    }

    getParams(eventId) {
        let params;
        
        Object.keys(this.events).forEach((id, index) => {
            if(eventId === id) {
                console.log(Object.values(this.events)[index])
                params = Object.values(this.events)[index].params || null;
            }
        });

        return params;
    }

    cleanup() {
        Object.values(this.events).forEach(event => {
            window.removeEventListener(event.type, event.listener);
        });
    }
}

export default function buildEventCollector() {
    window.eventCollector = new EventCollector();
}