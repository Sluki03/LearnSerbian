import loaded from "../functions/loaded.js";
import { Component } from "../components/Component.js";
import { buildEventList } from "../functions/EventControl.js";
import scrollingParallax from "../functions/scrollingParallax.js";

window.addEventListener("load", () => {
    loaded();
    buildEventList();

    Component.render();
    Component.create("ExercisesList");
    
    const body = document.querySelector("body");
    scrollingParallax({ scroll: window, bg: body });

    responsiveVoice.setDefaultVoice("Serbian Male");
});