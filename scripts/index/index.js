import loaded from "../functions/loaded.js";
import { buildEventList } from "../functions/EventControl.js";
import { Component } from "../components/Component.js";
import scrollingParallax from "../functions/scrollingParallax.js";

window.addEventListener("load", () => {
    loaded();
    buildEventList();
    
    Component.render();

    const body = document.querySelector("body");
    scrollingParallax({ scroll: window, bg: body });
});