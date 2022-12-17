import { Component } from "../../../../components/Component.js";
import { changeMode } from "../index.js";
import createElement from "../../../../functions/createElement.js";
import setTranslatableWords from "../../../setTranslatableWords.js";

export default function taskInterface(thisExercise) {
    const interfaceElement = document.querySelector(".interface");

    if(thisExercise.currentTask.cantHear === undefined) {
        Component.create("SpeakButton", {
            speak: thisExercise.currentTask.text,
            appendTo: interfaceElement
        });
    
        const textarea = createElement({
            tag: "textarea",
            attributes: {
                class: "interface",
                rows: 4,
                cols: 2,
                type: "text",
                placeholder: "Write what you hear...",
                maxLength: 200
            },
            events: [
                { on: "input", call: () => thisExercise.answerChanged(textarea.value) },
                { on: "keydown", call: e => { if(e.key === "Enter") e.preventDefault() } }
            ],
            appendTo: interfaceElement
        });
    
        textarea.focus();
    
        createElement({
            tag: "button",
            attributes: { class: "cant-hear-button" },
            innerText: "can't hear?",
            events: [{ on: "click", call: changeHearStatus }],
            appendTo: interfaceElement
        });

        function changeHearStatus() {
            thisExercise.currentTask.cantHear = true;
            changeMode(thisExercise);
        }
    }

    else {
        const translateHolderDisplay = createElement({
            tag: "div",
            attributes: { class: "translate-holder-display" },
            appendTo: interfaceElement
        });
        
        const translateHolderP = createElement({
            tag: "p",
            appendTo: translateHolderDisplay
        });

        setTranslatableWords(translateHolderP, thisExercise.currentTask.text, thisExercise.currentTask.translation, thisExercise.currentTask.englishSerbian);

        const textarea = createElement({
            tag: "textarea",
            attributes: {
                class: "interface",
                rows: 4,
                cols: 2,
                type: "text",
                placeholder: "Write the translation...",
                maxLength: 200
            },
            events: [
                { on: "input", call: () => thisExercise.answerChanged(textarea.value) },
                { on: "keydown", call: e => { if(e.key === "Enter") e.preventDefault() } }
            ],
            appendTo: interfaceElement
        });

        textarea.focus();
    }
}