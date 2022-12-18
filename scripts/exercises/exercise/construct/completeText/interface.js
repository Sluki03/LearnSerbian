import { Component } from "../../../../components/Component.js";
import { Convert } from "../../../../functions/Convert.js";
import createElement from "../../../../functions/createElement.js";
import { Shorten } from "../../../../functions/Shorten.js";
import randomArray from "../../../../functions/randomArray.js";
import { getAllPlaceholders, getFields, emptyFieldSelector } from "./functions.js";
import setTranslatableWords from "../../../setTranslatableWords.js";

export default function taskInterface(thisExercise, changeMode) {
    const interfaceElement = document.querySelector(".interface");

    window.eventList.add({ id: "taskCompleteTextKeydown", type: "keydown", listener: emptyFieldSelector, params: thisExercise });
    
    const completeTextP = createElement({
        tag: "p",
        attributes: { class: "complete-text-p" },
        appendTo: interfaceElement
    });

    const hintsStatus = thisExercise.currentTask.hints.status;
    setFields();

    setTranslatableWords(completeTextP, completeTextP.innerHTML, thisExercise.currentTask.translation, thisExercise.currentTask.englishSerbian);

    let fieldValues = {};
    setFieldValues();

    if(changeMode) applyAnswerChanges();
    
    if(thisExercise.currentTask.mode.type === "write") {
        const allPlaceholders = getAllPlaceholders(thisExercise);
        
        const allInputs = document.querySelectorAll("p input");

        allInputs.forEach((input, index) => {
            const inputName = input.id.split("-")[3];
            
            const prevInputValue = Object.values(thisExercise.prevModeValues.write.completeText)[index];
            const prevValuesStatus = Object.keys(thisExercise.prevModeValues.write.completeText).length > 0;
            
            input.value = prevValuesStatus && prevInputValue ? prevInputValue : "";

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

            const prevValueStatus = Object.keys(thisExercise.prevModeValues.wordBank.completeText.completeTextP).length > 0;
            const prevFieldValue = Object.values(thisExercise.prevModeValues.wordBank.completeText.completeTextP)[index];
            
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

        let randomOptions = randomArray(thisExercise.prevModeValues.wordBank.completeText.wordBank.length > 0 ? thisExercise.prevModeValues.wordBank.completeText.wordBank : thisExercise.currentTask.options);

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

                makeButton(span.innerText, true);
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
            
            optionElement.classList.remove("word-bank-option-selective");

            optionElement.style.opacity = "0";
            optionElement.style.top = "-10px";
            
            setTimeout(() => {
                const activeCompleteTextField = document.querySelector(".active-complete-text-field");
                const fieldName = activeCompleteTextField.id.split("-")[3];
                
                if(activeCompleteTextField.classList.contains("filled-complete-text-field")) {
                    makeButton(activeCompleteTextField.innerText, true);

                    activeCompleteTextField.innerHTML = hintsStatus ? fieldName : "&#8205;";
                    activeCompleteTextField.classList.remove("filled-complete-text-field");
                }
                
                activeCompleteTextField.classList.add("filled-complete-text-field");
                activeCompleteTextField.innerText = optionElement.innerText;

                fieldValues = {...fieldValues, [fieldName]: optionElement.innerText};
                applyAnswerChanges();

                optionElement.remove();
                emptyFieldSelector({ key: "Enter" });

                if(thisExercise.currentTask.speak) responsiveVoice.speak(optionElement.innerText);
                
                inProgress = false;
            }, 300);
        }

        function makeButton(option, animation = false) {
            let optionName = option;

            if(optionName.indexOf(" ") > -1) {
                optionName = optionName.replaceAll(" ", "-");
                optionName = Convert.cssToJsStandard(optionName);
            }
            
            const optionHolderSelector = document.querySelector(`.word-bank-option-holder-${optionName}`);
            
            const optionHolder = optionHolderSelector ? optionHolderSelector : createElement({
                tag: "div",
                attributes: { class: `word-bank-option-holder word-bank-option-holder-${optionName}` },
                appendTo: wordBank
            });
            
            const optionElement = createElement({
                tag: "button",
                attributes: { class: "word-bank-option word-bank-option-selective", id: `complete-text-word-bank-${optionName}` },
                innerText: option,
                style: animation ? { opacity: "0", top: "-10px" } : {},
                events: [{ on: "click", call: () => selectOption(optionElement) }],
                appendTo: optionHolder
            });

            if(optionHolderSelector === null) {
                const { height, width } = optionElement.getBoundingClientRect();

                optionHolder.style.height = `${height}px`;
                optionHolder.style.width = `${width}px`;
            }

            setTimeout(() => {
                optionElement.style.opacity = "";
                optionElement.style.top = "";
            }, 100);
        }
    }

    thisExercise.switchModes();

    function applyAnswerChanges() {        
        let setAnswer = true;
        Object.values(fieldValues).forEach(value => { if(!value) setAnswer = false });

        thisExercise.answerChanged(setAnswer ? fieldValues : "");
    }
    
    function setFieldValues() {        
        const validSelector = thisExercise.currentTask.mode.type === "write" ? "p input" : ".complete-text-field";
        const allFields = document.querySelectorAll(validSelector);

        allFields.forEach(field => {
            const fieldName = field.id.split("-")[3];

            const validPrevModeValuesProp = thisExercise.currentTask.mode.type === "write" ? thisExercise.prevModeValues.write.completeText : thisExercise.prevModeValues.wordBank.completeText.completeTextP;
            
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

        let innerText = thisExercise.currentTask.text;

        getFields(thisExercise).forEach(field => {
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

            const validFieldTemplate = thisExercise.currentTask.mode.type === "write" ? fieldTemplate.input : fieldTemplate.span;

            innerText = innerText.replace(`<${field}>`, validFieldTemplate);
        });

        function filledClass(fieldName) {
            const prevFields = {
                keys: Object.keys(thisExercise.prevModeValues.wordBank.completeText.completeTextP),
                values: Object.values(thisExercise.prevModeValues.wordBank.completeText.completeTextP)
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
        if(!thisExercise.currentTask.hints.status) return;

        const miniModal = document.querySelector(".mini-modal");
                
        setTimeout(() => Component.create("MiniModal", {
            target: target.element,
            id: target.id,
            className: "complete-text-word",
            content,
            blockKeydownClose: true
        }), miniModal ? 300 : 0);
    }
}