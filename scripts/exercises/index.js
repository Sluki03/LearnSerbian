import loaded from "../functions/other/loaded.js";
import { Component } from "../components/Component.js";
import { buildEventList } from "../functions/other/EventControl.js";
import scrollingParallax from "../functions/element/scrollingParallax.js";

window.addEventListener("load", () => {
    loaded();
    buildEventList();

    Component.render();
    Component.create("ExercisesList");
    
    const body = document.querySelector("body");
    scrollingParallax({ scroll: window, bg: body });

    responsiveVoice.setDefaultVoice("Serbian Male");
});