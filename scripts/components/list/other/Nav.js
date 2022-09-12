import { Component } from "../../Component.js";
import { navButtonsData } from "../../../../data/navButtonsData.js";
import createElement from "../../../functions/createElement.js";

export default function Nav(componentProps) {
    const { builtIn } = componentProps;
    const { id, appendTo } = componentProps.params;
    
    const navElement = builtIn ? builtIn : createElement({ tag: "nav", attributes: { id }, appendTo });

    const homeLink = createElement({
        tag: "a",
        attributes: { class: "nav-logo" },
        events: [{ on: "click", call: () => navigate("/") }],
        appendTo: navElement
    });

    Component.create("InteractiveTitle", { title: "learn serbian", appendTo: homeLink });

    const buttonHolder = createElement({ tag: "div", attributes: { class: "button-holder" }, appendTo: navElement });

    const pathname = window.location.pathname.substring(1).split(".")[0];
    const currentPage = (pathname === "index" || !pathname) ? "home" : pathname;
    
    navButtonsData.forEach(button => createElement({
        tag: "a",
        attributes: { id: currentPage === button.title ? "current-page" : "" },
        innerText: button.title,
        events: [{ on: "click", call: () => navigate(button.link) }],
        appendTo: buttonHolder
    }));
    
    function navigate(path) {
        let validPath = path;
        
        const exerciseModalTask = document.querySelector(".active-exercise-modal-task");
        if(exerciseModalTask === null) return window.location.href = validPath;
        
        closeExercise().then(result => {
            if(!result) validPath = "javascript: void(0)";
            window.location.href = validPath;
        });
    }
    
    async function closeExercise() {
        const exerciseModal = document.querySelector(".exercise-modal");
        
        return await new Promise(resolve => {
            Component.create("ClassicModal", {
                text: "Do you really want to close the exercise?",
                buttons: ["no", "yes"],
                functions: { yes: () => resolve(true), no: () => resolve(false) },
                appendTo: exerciseModal
            });
        });
    }

    return navElement;
}
