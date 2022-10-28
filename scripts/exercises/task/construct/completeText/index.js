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
        attributes: { class: "complete-text-p" },
        innerText: thisTask.currentTask.text,
        appendTo: completeTextHolder
    });

    const hintsButton = document.querySelector("[data-template='exercise-modal-task-complete-text-hints-button']").content.firstElementChild.cloneNode(true);
    completeTextHolder.appendChild(hintsButton);

    let hintsStatus = hintsButton.classList.contains("active-hints-button");
    
    const fullPlaceholders = [];

    const Placeholders = {
        set: () => {
            const allInputs = document.querySelectorAll("p input");
        
            allInputs.forEach((input, index) => {
                input.placeholder = fullPlaceholders[index];
                shortenPlaceholder(input);
            });
        },

        reset: () => {
            const allInputs = document.querySelectorAll("p input");
            allInputs.forEach(input => { input.placeholder = "" });
        }
    };

    hintsButton.onclick = () => {
        if(hintsStatus) {
            hintsButton.classList.remove("active-hints-button");
            hintsStatus = false;

            Placeholders.reset();
        }

        else {
            hintsButton.classList.add("active-hints-button");
            hintsStatus = true;

            Placeholders.set();
        }

        emptyInputSelector({ key: "Enter" });
    }

    let innerText = text.innerText;
    let inputValues = {};

    getInputs().forEach(input => {
        fullPlaceholders.push(input);

        let inputName = input;

        if(inputName.indexOf(" ") > -1) {
            inputName = inputName.replaceAll(" ", "-");
            inputName = Convert.cssToJsStandard(inputName);
        }
        
        const inputTemplate = `<input
            type='text'
            placeholder='${hintsStatus ? input : ""}'
            id="complete-input-${inputName}"
            autocomplete="off"
        >`;

        innerText = innerText.replace(`<${input}>`, inputTemplate);
        inputValues = {...inputValues, [inputName]: ""};
    });

    text.innerHTML = innerText;

    const allInputs = document.querySelectorAll("p input");
    allInputs[0].focus();

    allInputs.forEach((input, index) => {
        const inputName = input.id.split("-")[2];
        
        fullPlaceholders.push(input.placeholder);
        shortenPlaceholder(input);
        
        input.onfocus = () => {
            if(!hintsStatus) return;

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

    window.eventList.add({ id: "taskCompleteTextKeydown", type: "keydown", listener: emptyInputSelector });

    function emptyInputSelector(e) {
        if(thisTask.answer || e.key !== "Enter") return;

        const allInputs = document.querySelectorAll("p input");
        let targetInput = null;

        allInputs.forEach(input => {
            if(!input.value && targetInput === null) targetInput = input;
        });

        targetInput.focus();
    }

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