import scrollingParallax from "./scrollingParallax.js";
import createComponent from "../components/index.js";

window.addEventListener("load", () => {
    scrollingParallax();
    createComponent("exercisesList");
});