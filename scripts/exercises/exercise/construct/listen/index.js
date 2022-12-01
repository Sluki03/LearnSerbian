import { Component } from "../../../../components/Component.js";
import createElement from "../../../../functions/createElement.js";

export default function listen(thisExercise) {
    const { taskHolder } = thisExercise.elements;
    
    const listenHolder = createElement({
        tag: "div",
        attributes: { class: "listen-holder" },
        appendTo: taskHolder
    });

    const listenInterface = createElement({
        tag: "div", attributes: { class: "listen-interface" }, appendTo: listenHolder
    });

    Component.create("SpeakButton", {
        speak: thisExercise.currentTask.listenTo,
        appendTo: listenInterface
    });

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
        appendTo: listenInterface
    });
}