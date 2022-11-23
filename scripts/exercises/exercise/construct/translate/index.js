import taskInterface from "./interface.js";
import { Component } from "../../../../components/Component.js";
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
    
    const translateHolderDisplay = createElement({
        tag: "div",
        attributes: { class: "translate-holder-display" },
        appendTo: translateHolder
    });

    if(thisExercise.currentTask.speak) {
        if(!thisExercise.currentTask.englishSerbian && !responsiveVoice.isPlaying()) responsiveVoice.speak(thisExercise.currentTask.text);
        
        Component.create("SpeakButton", {
            speak: thisExercise.currentTask.text,
            appendTo: translateHolderDisplay
        });
    }
    
    const translateHolderP = createElement({
        tag: "p",
        appendTo: translateHolderDisplay
    });

    createElement({ tag: "div", attributes: { class: "interface" }, appendTo: translateHolder });

    setTranslatableWords(translateHolderP, thisExercise.currentTask.text, thisExercise.currentTask.translation, thisExercise.currentTask.englishSerbian);
    taskInterface(thisExercise);
}