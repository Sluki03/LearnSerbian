import { Component } from "../../../../components/Component.js";
import { Convert } from "../../../../functions/Convert.js";
import createElement from "../../../../functions/createElement.js";
import { Shorten } from "../../../../functions/Shorten.js";
import randomArray from "../../../../functions/randomArray.js";
import { getAllPlaceholders, getFields, emptyFieldSelector } from "./functions.js";

export default function taskInterface(thisTask, changeMode) {
    const interfaceElement = document.querySelector(".interface");

    window.eventList.remove("taskCompleteTextKeydown");
    window.eventList.add({ id: "taskCompleteTextKeydown", type: "keydown", listener: emptyFieldSelector, params: thisTask });
    
    createElement({
        tag: "p",
        attributes: { class: "complete-text-p" },
        innerText: thisTask.currentTask.text,
        appendTo: interfaceElement
    });

    const hintsStatus = thisTask.currentTask.hints.status;
    setFields();

    let fieldValues = {};
    setFieldValues();

    if(changeMode) applyAnswerChanges();
    
    if(thisTask.currentTask.mode.type === "write") {
        const allPlaceholders = getAllPlaceholders(thisTask);
        
        const allInputs = document.querySelectorAll("p input");

        allInputs.forEach((input, index) => {
            const inputName = input.id.split("-")[3];
            
            const prevInputValue = Object.values(thisTask.prevModeValues.write.completeText)[index];
            const prevValuesStatus = Object.keys(thisTask.prevModeValues.write.completeText).length > 0;
            
            input.value = prevValuesStatus ? prevInputValue : "";

            Shorten.placeholder(input);
            
            input.onfocus = () => showMiniModal({ element: input, id: inputName }, allPlaceholders[index]);
            
            input.oninput = () => {
                fieldValues = {...fieldValues, [inputName]: input.value};
                applyAnswerChanges();
            }
        });

        emptyFieldSelector({ key: "Enter" });
    }

    else {
        const allSpans = document.querySelectorAll(".complete-text-field");
        let activeCompleteTextFieldStatus = false;
        
        allSpans.forEach((span, index) => {
            span.onclick = () => setActiveCompleteTextField(span);

            const prevFieldValue = Object.values(thisTask.prevModeValues.wordBank.completeText.completeTextP)[index];
            const prevValueStatus = Object.keys(thisTask.prevModeValues.wordBank.completeText.completeTextP).length > 0;
            
            if(prevValueStatus && prevFieldValue !== undefined) span.innerText = prevFieldValue;

            Shorten.elementInnerText(span);
            
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

        let randomOptions = randomArray(thisTask.prevModeValues.wordBank.completeText.wordBank.length > 0 ? thisTask.prevModeValues.wordBank.completeText.wordBank : thisTask.currentTask.options);

        let allSpansFilledStatus = true;
        allSpans.forEach(span => { if(!span.classList.contains("filled-complete-text-field")) allSpansFilledStatus = false });
        
        if(allSpansFilledStatus) randomOptions = [];
        
        randomOptions.forEach(option => makeButton(option));

        function setActiveCompleteTextField(span) {
            const fieldName = span.id.split("-")[3];
            showMiniModal({ element: span, id: fieldName }, Convert.jsToCssStandard(fieldName).replaceAll("-", " "));
            
            if(span.classList.contains("active-complete-text-field")) {
                if(!span.classList.contains("filled-complete-text-field")) return;
                span.classList.remove("filled-complete-text-field");

                makeButton(span.innerText);
                span.innerHTML = hintsStatus ? fieldName : "&#8205;";

                fieldValues = {...fieldValues, [fieldName]: ""};
                applyAnswerChanges();
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
            const fieldName = activeCompleteTextField.id.split("-")[3];
            
            if(activeCompleteTextField.classList.contains("filled-complete-text-field")) {
                makeButton(activeCompleteTextField.innerText);

                activeCompleteTextField.innerHTML = hintsStatus ? fieldName : "&#8205;";
                activeCompleteTextField.classList.remove("filled-complete-text-field");
            }
            
            activeCompleteTextField.classList.add("filled-complete-text-field");
            activeCompleteTextField.innerText = optionElement.innerText;

            fieldValues = {...fieldValues, [fieldName]: optionElement.innerText};
            applyAnswerChanges();

            optionElement.remove();
            emptyFieldSelector({ key: "Enter" });
            
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
    }

    thisTask.switchModes();

    function applyAnswerChanges() {        
        let setAnswer = true;
        Object.values(fieldValues).forEach(value => { if(!value) setAnswer = false });

        thisTask.answerChanged(setAnswer ? fieldValues : "");
    }
    
    function setFieldValues() {        
        const validSelector = thisTask.currentTask.mode.type === "write" ? "p input" : ".complete-text-field";
        const allFields = document.querySelectorAll(validSelector);

        allFields.forEach(field => {
            const fieldName = field.id.split("-")[3];

            const validPrevModeValuesProp = thisTask.currentTask.mode.type === "write" ? thisTask.prevModeValues.write.completeText : thisTask.prevModeValues.wordBank.completeText.completeTextP;
            
            const prevFields = {
                keys: Object.keys(validPrevModeValuesProp),
                values: Object.values(validPrevModeValuesProp)
            };

            let fieldValue = "";

            prevFields.keys.forEach((key, index) => {
                if(fieldName === key && prevFields.values[index]) fieldValue = prevFields.values[index];
            });

            fieldValues = {...fieldValues, [fieldName]: fieldValue};
        });
    }
    
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
                    type="text"
                    placeholder='${hintsStatus ? field : ""}'
                    id="complete-text-field-${fieldName}"
                    autocomplete="off"
                >`,
                span: `<span
                    class="complete-text-field ${filledClass(fieldName)}"
                    id="complete-text-field-${fieldName}"
                >${hintsStatus ? field : "&#8205;"}</span>`
            };

            const validFieldTemplate = thisTask.currentTask.mode.type === "write" ? fieldTemplate.input : fieldTemplate.span;

            innerText = innerText.replace(`<${field}>`, validFieldTemplate);
        });

        function filledClass(fieldName) {
            const prevFields = {
                keys: Object.keys(thisTask.prevModeValues.wordBank.completeText.completeTextP),
                values: Object.values(thisTask.prevModeValues.wordBank.completeText.completeTextP)
            };

            let result = false;

            prevFields.keys.forEach((key, index) => {
                if(fieldName === key && prevFields.values[index]) result = true;
            });

            return result ? "filled-complete-text-field" : "";
        }

        text.innerHTML = innerText;
    }

    function showMiniModal(target, content) {
        if(!thisTask.currentTask.hints.status) return;

        const miniModal = document.querySelector(".mini-modal");
                
        setTimeout(() => Component.create("MiniModal", {
            target: target.element,
            id: target.id,
            content
        }), miniModal ? 300 : 0);
    }
}