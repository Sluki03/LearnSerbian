import taskInterface from "./interface.js";
import createElement from "../../../../functions/createElement.js";
import setTranslatableWords from "../../setTranslatableWords.js";

export default function translate(thisExercise, changeMode) {
    if(changeMode) return taskInterface(thisExercise);
    
    const { taskHolder } = thisExercise.elements;
    
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

    setTranslatableWords(translateHolderP, thisExercise.currentTask.text, thisExercise.currentTask.translation);
    taskInterface(thisExercise);
}