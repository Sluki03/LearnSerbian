import scrollingParallax from "./scrollingParallax.js";
import createComponent from "../functions/createComponent.js";

window.addEventListener("load", () => {
    createComponent("nav", "exercises-nav");
    scrollingParallax();
    createComponent("exercisesList");
});