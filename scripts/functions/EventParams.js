export const EventParams = { set, get, remove };

function set(key, value) {
    if(window.eventParams === undefined) window.eventParams = {};

    Object.keys(window.eventParams).forEach(windowKey => {
        if(key === windowKey) window.eventParams = {...window.eventParams, [key]: {}};
    });

    window.eventParams = {...window.eventParams, [key]: value};
}

function get(key) {
    if(window.eventParams === undefined) return null;

    let result = null;

    Object.keys(window.eventParams).forEach((windowKey, index) => {
        if(key === windowKey) result = Object.values(window.eventParams)[index];
    });

    return result;
}

function remove(key) {
    if(window.eventParams === undefined) return null;

    let newEventParams = {};

    Object.keys(window.eventParams).forEach((windowKey, index) => {
        if(key === windowKey) return;
        let newEventParams = {...newEventParams, [windowKey]: Object.values(window.eventParams)[index]};
    });

    window.eventParams = newEventParams;
}