import loaded from "../functions/loaded.js";
import { Component } from "../components/Component.js";
import buildEventCollector from "../functions/EventCollector.js";
import scrollingParallax from "../functions/scrollingParallax.js";

window.addEventListener("load", () => {
    loaded();
    buildEventCollector();

    Component.render();
    Component.create("ExercisesList");
    
    const exercisesHolder = document.querySelector(".exercises-holder");
    scrollingParallax({ scroll: exercisesHolder, bg: exercisesHolder });
});