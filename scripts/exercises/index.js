import cancelLoading from "../functions/cancelLoading.js";
import createComponent from "../functions/createComponent.js";
import scrollingParallax from "../functions/scrollingParallax.js";

window.addEventListener("load", () => {
    cancelLoading(".exercises-loading");
    
    createComponent("nav");
    createComponent("exercisesList");
    
    const exercisesHolder = document.querySelector(".exercises-holder");
    scrollingParallax({ scroll: exercisesHolder, bg: exercisesHolder });
});