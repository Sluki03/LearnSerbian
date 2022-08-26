import scrollingParallax from "./scrollingParallax.js";
import createComponent from "../functions/createComponent.js";

window.addEventListener("load", () => {
    scrollingParallax();
    createComponent("exercisesList");
});