import { Inputs, Spans } from "./functions.js";

export default function modes(thisTask) {
    if(thisTask.currentTask.mode.type === "write") {
        thisTask.currentTask.mode.type = "wordBank";
        if(thisTask.currentTask.hints.status) Spans.set(thisTask);

        const allInputs = document.querySelectorAll("p input");
        const usedOptions = [];

        allInputs.forEach(input => {
            const inputName = input.id.split("-")[3];
            thisTask.prevModeValues.write.completeText = {...thisTask.prevModeValues.write.completeText, [inputName]: input.value};

            const optionIndex = thisTask.currentTask.options.indexOf(input.value);
            const option = thisTask.currentTask.options[optionIndex] ? thisTask.currentTask.options[optionIndex] : "";

            if(option) {
                thisTask.prevModeValues.wordBank.completeText.completeTextP = {
                    ...thisTask.prevModeValues.wordBank.completeText.completeTextP,
                    [inputName]: option
                };
    
                usedOptions.push(option);
            }

            thisTask.prevModeValues.wordBank.completeText.wordBank = [];

            if(usedOptions.length > 0) thisTask.currentTask.options.forEach(option => {
                if(usedOptions.indexOf(option) > -1) return;
                thisTask.prevModeValues.wordBank.completeText.wordBank.push(option);
            });
        });
    }

    else {
        thisTask.currentTask.mode.type = "write";
        if(thisTask.currentTask.hints.status) Inputs.set(thisTask);

        const allSpans = document.querySelectorAll(".complete-text-field");
        
        allSpans.forEach(span => {
            const fieldName = span.id.split("-")[3];
            
            thisTask.prevModeValues.wordBank.completeText.completeTextP = {
                ...thisTask.prevModeValues.wordBank.completeText.completeTextP,
                [fieldName]: span.classList.contains("filled-complete-text-field") ? span.innerText : ""
            };

            if(span.classList.contains("filled-complete-text-field")) thisTask.prevModeValues.write.completeText = {
                ...thisTask.prevModeValues.write.completeText,
                [fieldName]: span.innerText
            };
        });

        let wordBankOptions = thisTask.currentTask.options;
        const prevCompleteTextPValues = Object.values(thisTask.prevModeValues.wordBank.completeText.completeTextP);
        wordBankOptions = wordBankOptions.filter(option => prevCompleteTextPValues.indexOf(option) === -1);

        thisTask.prevModeValues.wordBank.completeText.wordBank = wordBankOptions;
        
        const wordBank = document.querySelector(".complete-text-word-bank");
        wordBank.remove();
    }
}