import { Component } from "../../../components/Component.js";
import createElement from "../../../functions/createElement.js";
import setTranslatableWords from "../../setTranslatableWords.js";

export default function listen(reviewProps) {
    const { current, taskReview } = reviewProps;
    const { task } = current;
    
    const listenHolder = createElement({
        tag: "div",
        attributes: { class: "listen-holder" },
        appendTo: taskReview
    });

    Component.create("SpeakButton", { speak: task.text, appendTo: listenHolder });

    const textP = createElement({
        tag: "p",
        attributes: { class: "text-p" },
        appendTo: listenHolder
    });

    setTranslatableWords(textP, task.text, task.translation, task.englishSerbian);
}