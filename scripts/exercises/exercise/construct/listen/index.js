import taskInterface from "./interface.js";
import createElement from "../../../../functions/createElement.js";

export default function listen(thisExercise, changeMode) {
    if(changeMode) return taskInterface(thisExercise);
    
    const { taskHolder } = thisExercise.elements;
    
    const listenHolder = createElement({
        tag: "div",
        attributes: { class: "listen-holder" },
        appendTo: taskHolder
    });

    createElement({ tag: "div", attributes: { class: "interface" }, appendTo: listenHolder });
    taskInterface(thisExercise);
}