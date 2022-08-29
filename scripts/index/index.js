import getComponents from "../functions/getComponent.js";
import createComponent from "../functions/createComponent.js";
import scrollingParallax from "../functions/scrollingParallax.js";

window.addEventListener("load", () => {
    getComponents("interactiveTitle");
    createComponent("nav");
    createComponent("panelsList");

    const body = document.querySelector("body");
    scrollingParallax({ scroll: window, bg: body });
});