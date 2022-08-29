import loaded from "../functions/loaded.js";
import { Component } from "../components/component.js";
import scrollingParallax from "../functions/scrollingParallax.js";

window.addEventListener("load", () => {
    loaded();
    
    Component.create("nav");
    Component.create("exercisesList");

    Component.render();
    
    const exercisesHolder = document.querySelector(".exercises-holder");
    scrollingParallax({ scroll: exercisesHolder, bg: exercisesHolder });
});