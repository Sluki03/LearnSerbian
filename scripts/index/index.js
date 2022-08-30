import loaded from "../functions/loaded.js";
import { Component } from "../components/component.js";
import scrollingParallax from "../functions/scrollingParallax.js";

window.addEventListener("load", () => {
    loaded();
    
    Component.render();

    const body = document.querySelector("body");
    scrollingParallax({ scroll: window, bg: body });
});