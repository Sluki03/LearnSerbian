import taskInterface from "./interface.js";
import createElement from "../../../../functions/createElement.js";
import setTranslatableWords from "../../setTranslatableWords.js";

export default function translate(thisTask, changeMode) {
    if(changeMode) return taskInterface(thisTask);
    
    const { taskHolder } = thisTask.elements;
    
    const translateHolder = createElement({
        tag: "div",
        attributes: { class: "translate-holder" },
        appendTo: taskHolder
    });
    
    const translateHolderP = createElement({
        tag: "p",
        appendTo: translateHolder
    });

    createElement({ tag: "div", attributes: { class: "interface" }, appendTo: translateHolder });

    setTranslatableWords(translateHolderP, thisTask.currentTask.text, thisTask.currentTask.translation);
    taskInterface(thisTask);
}