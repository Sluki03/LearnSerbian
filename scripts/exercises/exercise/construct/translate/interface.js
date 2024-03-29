import { Component } from "../../../../components/Component.js";
import createElement from "../../../../functions/element/createElement.js";
import randomArray from "../../../../functions/other/randomArray.js";

export default function taskInterface(thisExercise) {
    const interfaceElement = document.querySelector(".interface");
    
    if(thisExercise.currentTask.mode.type === "write") {
        const translateHolderTextarea = createElement({
            tag: "textarea",
            attributes: {
                class: "interface",
                rows: 4,
                cols: 2,
                type: "text",
                placeholder: "Write the translation...",
                maxLength: 200
            },
            events: [
                { on: "input", call: () => thisExercise.answerChanged(translateHolderTextarea.value)},
                { on: "keydown", call: e => { if(e.key === "Enter") e.preventDefault() } },
                { on: "focus", call: () => translateHolderTextarea.classList.add("translate-holder-textarea-focused") },
                
                { on: "blur", call: e => {
                    if(e.relatedTarget && e.relatedTarget.nodeName.toLowerCase() === "button") translateHolderTextarea.focus();
                    else translateHolderTextarea.classList.remove("translate-holder-textarea-focused");
                }}
            ],
            appendTo: interfaceElement
        });

        if(thisExercise.prevModeValues.write.translate.textareaValue) translateHolderTextarea.value = thisExercise.prevModeValues.write.translate.textareaValue;
        translateHolderTextarea.focus();

        if(thisExercise.currentTask.diacriticKeyboard || thisExercise.currentTask.diacriticKeyboard === undefined) Component.create("DiacriticKeyboard", {
            input: translateHolderTextarea,
            answerChanged: thisExercise.answerChanged,
            appendTo: interfaceElement
        });
    }

    else {
        const textHolder = createElement({
            tag: "div",
            attributes: { class: "text-holder" },
            appendTo: interfaceElement
        });
        
        const wordBankOptionsHolder = createElement({
            tag: "div",
            attributes: { class: "word-bank-options-holder" },
            appendTo: interfaceElement
        });
        
        if(thisExercise.prevModeValues.wordBank.translate.textHolder.length > 0) {        
            thisExercise.prevModeValues.wordBank.translate.textHolder.forEach(option => getWordBankOption(option, true));
            thisExercise.prevModeValues.wordBank.translate.wordBank.forEach(option => getWordBankOption(option, true));
        }
        
        else {
            const randomOptions = randomArray(thisExercise.currentTask.options);
            randomOptions.forEach(option => getWordBankOption(option));
        }

        function getWordBankOption(option, isDynamic) {
            const optionSelectiveTypeClass = isDynamic ? `word-bank-option-${isSelective(option)}` : "word-bank-option-selective";
            
            const selectiveType = isSelective(option);
            const moveOptionType = isDynamic ? selectiveType.substring(0, selectiveType.length - 3) : "select";
            
            const selectiveTypeAppendTo = isDynamic ? selectiveType === "selective" ? wordBankOptionsHolder : textHolder : wordBankOptionsHolder;
            const optionHolderStatus = selectiveTypeAppendTo.classList.contains("word-bank-options-holder");
            
            const optionHolder = optionHolderStatus ? createElement({
                tag: "div",
                attributes: { class: `word-bank-option-holder word-bank-option-holder-${option}` },
                appendTo: selectiveTypeAppendTo
            }) : null;
            
            const optionElement = createElement({
                tag: "button",
                attributes: { class: `word-bank-option word-bank-option-${option} ${optionSelectiveTypeClass}` },
                innerText: option,
                events: [{ on: "click", call: () => moveOption(option, moveOptionType) }],
                appendTo: optionHolderStatus ? optionHolder : selectiveTypeAppendTo
            });

            if(optionHolder) {
                const { height, width } = optionElement.getBoundingClientRect();

                optionHolder.style.height = `${height}px`;
                optionHolder.style.width = `${width}px`;
            }
        }
    }

    thisExercise.switchModes();

    function isSelective(option) {
        let result;

        if(thisExercise.prevModeValues.wordBank.translate.textHolder.indexOf(option) > -1) result = false;
        if(thisExercise.prevModeValues.wordBank.translate.wordBank.indexOf(option) > -1) result = true;

        return result ? "selective" : "deselective";
    }

    let inProgress = false;

    function moveOption(option, type) {
        if(inProgress) return;
        inProgress = true;
        
        const textHolder = document.querySelector(".text-holder");

        const selectedOption = document.querySelector(`.word-bank-option-${option}`);
        const selectedOptionHolder = document.querySelector(`.word-bank-option-holder-${option}`);

        const removeableClasses = ["word-bank-option-selective", "word-bank-option-deselective"];
        
        removeableClasses.forEach(removeableClass => {
            if(selectedOption.classList.contains(removeableClass)) selectedOption.classList.remove(removeableClass);
        });
        
        const selectedOptionClone = selectedOption.cloneNode(true);

        if(
            thisExercise.currentTask.speak &&
            thisExercise.currentTask.englishSerbian &&
            type === "select"
        ) responsiveVoice.speak(option);
        
        selectedOption.classList.add(type === "select" ? "word-bank-option-selective" : "word-bank-option-deselective");
        selectedOptionClone.classList.add(type !== "select" ? "word-bank-option-selective" : "word-bank-option-deselective");

        selectedOption.style.opacity = "0";
        selectedOption.style.top = type === "select" ? "-10px" : "10px";

        selectedOptionClone.style.opacity = "0";
        selectedOptionClone.style.top = type === "select" ? "10px" : "-10px";

        setTimeout(() => {
            selectedOption.remove();

            const appendElement = type === "select" ? textHolder : selectedOptionHolder;
            const invertedType = type === "select" ? "deselect" : "select";

            appendElement.appendChild(selectedOptionClone);
            
            setTimeout(() => {
                selectedOptionClone.style.opacity = "";
                selectedOptionClone.style.top = "";
            }, 100);
            
            selectedOptionClone.onclick = () => moveOption(option, invertedType);

            let textArray = [];
            
            [...textHolder.children].forEach(child => {
                textArray.push(child.innerText);
            });

            thisExercise.answerChanged(textArray.join(" "));
            inProgress = false;
        }, 300);
    }
}