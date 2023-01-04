import loaded from "../functions/other/loaded.js";
import { buildEventList } from "../functions/other/EventControl.js";
import { Component } from "../components/Component.js";
import scrollingParallax from "../functions/element/scrollingParallax.js";

window.addEventListener("load", () => {
    loaded();
    buildEventList();
    
    Component.render();

    const body = document.querySelector("body");
    scrollingParallax({ scroll: window, bg: body });
});