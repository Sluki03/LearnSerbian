import { Convert } from "../../../functions/text/Convert.js";
import createElement from "../../../functions/element/createElement.js";

export default function mode(reviewProps) {
    const { current, taskReview } = reviewProps;
    const { task } = current;
    
    if(!task.mode) return;

    const modeInfo = createElement({
        tag: "div",
        attributes: { class: "mode-info" },
        appendTo: taskReview
    });
    
    createElement({
        tag: "strong",
        innerText: "Mode",
        appendTo: modeInfo
    });

    const modeInfoHolder = createElement({
        tag: "div",
        attributes: { class: "mode-info-holder" },
        appendTo: modeInfo
    });

    const icons = {
        write: { src: "./images/icons/write-icon.png", alt: "Write" },
        wordBank: { src: "./images/icons/word-bank-icon.png", alt: "Word Bank" },
        multipleChoice: { src: "./images/icons/multiple-choice-icon.png", alt: "Multiple Choice" }
    };

    let validIcon = {};

    Object.keys(icons).forEach((key, index) => {
        if(task.mode.type === key) validIcon = Object.values(icons)[index];
    });

    createElement({
        tag: "img",
        attributes: validIcon,
        appendTo: modeInfoHolder
    });

    let modeName = Convert.jsToCssStandard(task.mode.type).replaceAll("-", " ");
    modeName = modeName[0].toUpperCase() + modeName.substring(1);

    createElement({
        tag: "p",
        innerHTML: `The task has been finished using <span>${modeName}</span> mode.`,
        appendTo: modeInfoHolder
    });
}