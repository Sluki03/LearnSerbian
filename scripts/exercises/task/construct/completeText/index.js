import { Component } from "../../../../components/Component.js";
import { Convert } from "../../../../functions/Convert.js";
import createElement from "../../../../functions/createElement.js";
import shortenPlaceholder from "../../../../functions/shortenPlaceholder.js";

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

    let innerText = text.innerText;
    let inputValues = {};

    getInputs().forEach(input => {
        let inputName = input;

        if(inputName.indexOf(" ") > -1) {
            inputName = inputName.replaceAll(" ", "-");
            inputName = Convert.cssToJsStandard(inputName);
        }
        
        const inputTemplate = `<input
            type='text'
            placeholder='${input}'
            id="complete-input-${inputName}"
            autocomplete="off"
        >`;

        innerText = innerText.replace(`<${input}>`, inputTemplate);
        inputValues = {...inputValues, [inputName]: ""};
    });

    text.innerHTML = innerText;

    const allInputs = document.querySelectorAll("p input");
    const fullPlaceholders = [];

    allInputs.forEach((input, index) => {
        const inputName = input.id.split("-")[2];
        
        fullPlaceholders.push(input.placeholder);
        shortenPlaceholder(input);
        
        input.onfocus = () => {
            const miniModal = document.querySelector(".mini-modal");
            
            setTimeout(() => Component.create("MiniModal", {
                target: input,
                id: inputName,
                content: fullPlaceholders[index]
            }), miniModal ? 300 : 0);
        }
        
        input.oninput = () => {
            inputValues = {...inputValues, [inputName]: input.value};
            const filledInputs = [];

            Object.values(inputValues).forEach(value => {
                let filled = false;
                if(value) filled = true;

                filledInputs.push(filled);
            });

            let setAnswer = true;
            filledInputs.forEach(filledInput => { if(!filledInput) setAnswer = false });

            thisTask.answerChanged(setAnswer ? inputValues : "");
        }
    });

    function getInputs() {
        const positions = [];
        let currentPosition = { start: -1, end: -1 };
        
        for(let i = 0; i < innerText.length; i++) {
            if(innerText[i] === "<") currentPosition.start = i;

            if(innerText[i] === ">") {
                currentPosition.end = i;
                positions.push(currentPosition);
                currentPosition = { start: -1, end: -1 };
            }
        }

        const inputs = [];
        let currentInput = "";

        positions.forEach(position => {
            for(let i = position.start + 1; i < position.end; i++) currentInput += innerText[i];
            
            inputs.push(currentInput);
            currentInput = "";
        });

        return inputs;
    }
}