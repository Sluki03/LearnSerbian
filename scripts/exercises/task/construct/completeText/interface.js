import { Component } from "../../../../components/Component.js";
import { Convert } from "../../../../functions/Convert.js";
import createElement from "../../../../functions/createElement.js";
import { Shorten } from "../../../../functions/Shorten.js";
import randomArray from "../../../../functions/randomArray.js";
import { getAllPlaceholders, getFields } from "./functions.js";

export default function taskInterface(thisTask) {
    const hintsStatus = thisTask.currentTask.hints.status;
    setFields();
    
    if(thisTask.currentTask.mode.type === "write") {
        const allPlaceholders = getAllPlaceholders(thisTask);
        
        const allInputs = document.querySelectorAll("p input");
        allInputs[0].focus();

        allInputs.forEach((input, index) => {
            const inputName = input.id.split("-")[2];
            Shorten.placeholder(input);
            
            input.onfocus = () => {
                if(!hintsStatus) return;

                const miniModal = document.querySelector(".mini-modal");
                
                setTimeout(() => Component.create("MiniModal", {
                    target: input,
                    id: inputName,
                    content: allPlaceholders[index]
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
    }

    else {
        const allSpans = document.querySelectorAll(".complete-field");
        allSpans.forEach(span => Shorten.elementInnerText(span));
        
        const completeTextHolder = document.querySelector(".complete-text-holder");
        
        const wordBank = createElement({
            tag: "div",
            attributes: { class: "complete-text-word-bank" },
            appendTo: completeTextHolder
        });

        const randomOptions = randomArray(thisTask.currentTask.options);

        randomOptions.forEach(option => createElement({
            tag: "button",
            attributes: { id: `complete-text-word-bank-${option}` },
            innerText: option,
            appendTo: wordBank
        }));
    }

    thisTask.switchModes();

    function setFields() {
        const text = document.querySelector(".complete-text-p");
        const allFields = [];

        let innerText = thisTask.currentTask.text;
        let inputValues = {};

        getFields(thisTask).forEach(field => {
            allFields.push(field);

            let fieldName = field;

            if(fieldName.indexOf(" ") > -1) {
                fieldName = fieldName.replaceAll(" ", "-");
                fieldName = Convert.cssToJsStandard(fieldName);
            }
            
            const fieldTemplate = {
                input: `<input
                    type='text'
                    placeholder='${hintsStatus ? field : ""}'
                    id="complete-field-${fieldName}"
                    autocomplete="off"
                >`,
                div: `<span class="complete-field" id="complete-field-${fieldName}">${hintsStatus ? field : "&#8205;"}</span>`
            };

            const validFieldTemplate = thisTask.currentTask.mode.type === "write" ? fieldTemplate.input : fieldTemplate.div;

            innerText = innerText.replace(`<${field}>`, validFieldTemplate);
            if(thisTask.currentTask.mode.type === "wordBank") inputValues = {...inputValues, [fieldName]: ""};
        });

        text.innerHTML = innerText;
    }
}