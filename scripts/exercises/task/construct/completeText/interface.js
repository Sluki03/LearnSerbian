import { Component } from "../../../../components/Component.js";
import { Convert } from "../../../../functions/Convert.js";
import createElement from "../../../../functions/createElement.js";
import { Shorten } from "../../../../functions/Shorten.js";
import randomArray from "../../../../functions/randomArray.js";
import { getAllPlaceholders, getFields } from "./functions.js";

export default function taskInterface(thisTask) {
    const interfaceElement = document.querySelector(".interface");
    let inputValues = {};
    
    createElement({
        tag: "p",
        attributes: { class: "complete-text-p" },
        innerText: thisTask.currentTask.text,
        appendTo: interfaceElement
    });

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
        const allSpans = document.querySelectorAll(".complete-text-field");
        let activeCompleteTextFieldStatus = false;
        
        allSpans.forEach(span => {
            Shorten.elementInnerText(span);
            span.onclick = () => setActiveCompleteTextField(span);

            if(!activeCompleteTextFieldStatus && !span.classList.contains("filled-complete-text-field")) {
                span.classList.add("active-complete-text-field");
                activeCompleteTextFieldStatus = true;
            }
        });
        
        const wordBank = createElement({
            tag: "div",
            attributes: { class: "complete-text-word-bank" },
            appendTo: interfaceElement
        });

        const randomOptions = randomArray(thisTask.currentTask.options);

        randomOptions.forEach(option => makeButton(option));

        function setActiveCompleteTextField(span) {
            if(span.classList.contains("active-complete-text-field")) {
                if(!span.classList.contains("filled-complete-text-field")) return;
                
                makeButton(span.innerText);
                span.innerHTML = hintsStatus ? span.classList[0].split("-")[3] : "&#8205;";
            }
            
            else {
                allSpans.forEach(span => {
                    if(span.classList.contains("active-complete-text-field")) span.classList.remove("active-complete-text-field");
                });
    
                span.classList.add("active-complete-text-field");
                if(!activeCompleteTextFieldStatus) activeCompleteTextFieldStatus = true;
            }
        }

        let inProgress = false;
        
        function selectOption(optionElement) {
            if(inProgress) return;
            inProgress = true;

            const activeCompleteTextField = document.querySelector(".active-complete-text-field");
            
            if(activeCompleteTextField.classList.contains("filled-complete-text-field")) {
                makeButton(activeCompleteTextField.innerText);

                activeCompleteTextField.innerHTML = hintsStatus ? activeCompleteTextField.classList[0].split("-")[3] : "&#8205;";
                activeCompleteTextField.classList.remove("filled-complete-text-field");
            }
            
            activeCompleteTextField.classList.add("filled-complete-text-field");
            activeCompleteTextField.innerText = optionElement.innerText;

            optionElement.remove();
            emptyFieldSelector();
            
            inProgress = false;
        }

        function makeButton(option) {
            let optionName = option;

            if(optionName.indexOf(" ") > -1) {
                optionName = optionName.replaceAll(" ", "-");
                optionName = Convert.cssToJsStandard(optionName);
            }
            
            const optionElement = createElement({
                tag: "button",
                attributes: { class: "word-bank-option", id: `complete-text-word-bank-${optionName}` },
                innerText: option,
                events: [{ on: "click", call: () => selectOption(optionElement) }],
                appendTo: wordBank
            });
        }

        function emptyFieldSelector() {
            const existingActiveCompleteTextField = document.querySelector(".active-complete-text-field");
            existingActiveCompleteTextField.classList.remove("active-complete-text-field");

            if(wordBank.children.length === 0) return;
            
            let targetField = null;

            allSpans.forEach(span => {
                if(targetField !== null || span.classList.contains("filled-complete-text-field")) return;
                targetField = span;
            });

            targetField.classList.add("active-complete-text-field");
        }
    }

    thisTask.switchModes();

    function setFields() {
        const text = document.querySelector(".complete-text-p");
        const allFields = [];

        let innerText = thisTask.currentTask.text;

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
                    id="complete-text-field-${fieldName}"
                    autocomplete="off"
                >`,
                span: `<span
                    class="complete-text-field"
                    id="complete-text-field-${fieldName}"
                >${hintsStatus ? field : "&#8205;"}</span>`
            };

            const validFieldTemplate = thisTask.currentTask.mode.type === "write" ? fieldTemplate.input : fieldTemplate.span;

            innerText = innerText.replace(`<${field}>`, validFieldTemplate);
            if(thisTask.currentTask.mode.type === "wordBank") inputValues = {...inputValues, [fieldName]: ""};
        });

        text.innerHTML = innerText;
    }
}