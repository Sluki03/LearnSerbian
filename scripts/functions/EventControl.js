class EventControl {
    constructor(parent) {
        this.parent = parent;
        this.events = {};
    }

    add(...events) {
        const classicEvents = [];
        
        events.forEach(event => {
            const addingType = this.#getAddingType(event);

            if(addingType === "advanced") {
                Object.keys(event).forEach((key, index) => {
                    const value = Object.values(event)[index];

                    const validEvent = { id: key, ...value };
                    classicEvents.push(validEvent);
                });
            }

            else classicEvents.push(event);
        });

        classicEvents.forEach(classicEvent => {
            const alreadyExists = Object.keys(this.get()).indexOf(classicEvent.id) > -1;
            
            if(alreadyExists) this.remove(classicEvent.id);
            this.parent.addEventListener(classicEvent.type, classicEvent.listener, classicEvent.options);

            this.#collect(classicEvent);
        });
    }

    #getAddingType(event) {
        let hasId = false;

        Object.keys(event).forEach((key, index) => {
            if(key === "id") {
                const value = Object.values(event)[index];
                if(typeof value === "string") hasId = true;
            }
        });

        const type = hasId ? "classic" : "advanced";
        return type;
    }

    remove(...eventIds) {
        eventIds.forEach(eventId => {
            let event;
            
            Object.keys(this.events).forEach((id, index) => {
                if(eventId === id) event = Object.values(this.events)[index];
            });

            if(event) {
                this.parent.removeEventListener(event.type, event.listener);
                this.#drop(eventId);
            }
        });
    }

    get(eventId) {
        if(eventId === undefined) return this.events;

        let event = null;

        Object.keys(this.events).forEach((id, index) => {
            if(eventId === id) event = Object.values(this.events)[index];
        });

        return event;
    }
    
    #collect(event) {
        let eventObject;

        Object.keys(event).forEach((key, index) => {
            if(key === "id") return;
            eventObject = {...eventObject, [key]: Object.values(event)[index]};
        });

        this.events = {...this.events, [event.id]: eventObject};
    }

    #drop(eventId) {
        let newEvents = {};

        Object.keys(this.events).forEach((key, index) => {
            if(eventId === key) return;
            newEvents = {...newEvents, [key]: Object.values(this.events)[index]};
        });

        this.events = newEvents;
    }

    getParams(eventId) {
        let params;
        
        Object.keys(this.events).forEach((id, index) => {
            if(eventId === id) params = Object.values(this.events)[index].params || null;
        });

        return params;
    }

    cleanup() {
        Object.values(this.events).forEach(event => {
            this.parent.removeEventListener(event.type, event.listener);
        });
    }
}

export function buildEventList(element) {
    if(window.eventList === undefined) window.eventList = new EventControl(window);

    const body = document.querySelector("body");
    childrenBuild(element || body);

    function childrenBuild(element) {
        if(element.eventList === undefined) element.eventList = new EventControl(element);
        [...element.children].forEach(child => childrenBuild(child));
    }
}