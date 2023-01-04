import createElement from "../../../functions/element/createElement.js";
import loadExercises from "../../../exercises/loadExercises.js";

export default function ExercisesList(componentProps) {
    const list = document.querySelector(".exercises-list");
    if(componentProps.params === undefined) return list;

    createElement({
        tag: "div",
        attributes: { class: "exercises-list-line" },
        appendTo: list
    });

    for(let i = 0; i < 2; i++) {
        const startEndHolder = createElement({
            tag: "div",
            attributes: { class: `exercises-list-start-end-holder ${i === 0 ? "start-holder" : "end-holder"}` },
            appendTo: list
        });

        createElement({
            tag: "img",
            attributes: { src: `./images/icons/${i === 0 ? "start" : "end"}-icon.png`, alt: i === 0 ? "START" : "END" },
            appendTo: startEndHolder
        });
        
        createElement({
            tag: "strong",
            attributes: { class: `exercises-list-${i === 0 ? "start" : "end"}` },
            innerText: i === 0 ? "start" : "end",
            appendTo: startEndHolder
        });
    }

    loadExercises();

    return list;
}
