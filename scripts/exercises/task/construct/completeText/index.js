import createElement from "../../../../functions/createElement.js";

export default function completeText(thisTask) {
    const { taskHolder } = thisTask.elements;

    const completeTextHolder = createElement({
        tag: "div",
        attributes: { class: "complete-text-holder" },
        appendTo: taskHolder
    });

    const text = createElement({
        tag: "p",
        innerText: thisTask.currentTask.text,
        appendTo: completeTextHolder
    });

    const inputTemplate = `<input type='text' placeholder='${thisTask.currentTask.content}'>`;

    let innerText = text.innerText;
    innerText = innerText.replaceAll("<input>", inputTemplate);
    text.innerHTML = innerText;

    const input = text.children[0];
    input.oninput = () => thisTask.answerChanged(input.value);
}