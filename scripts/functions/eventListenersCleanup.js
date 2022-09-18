export default function eventListenersCleanup(...events) {
    events.forEach(event => {
        window.removeEventListener(event.type, event.listener);
    });
}