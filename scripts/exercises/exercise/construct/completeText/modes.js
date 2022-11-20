import { Inputs, Spans } from "./functions.js";

export default function modes(thisExercise) {
    if(thisExercise.currentTask.mode.type === "write") {
        thisExercise.currentTask.mode.type = "wordBank";
        if(thisExercise.currentTask.hints.status) Spans.set(thisExercise);

        const allInputs = document.querySelectorAll("p input");
        const usedOptions = [];

        allInputs.forEach(input => {
            const inputName = input.id.split("-")[3];
            if(input.value) thisExercise.prevModeValues.write.completeText = {...thisExercise.prevModeValues.write.completeText, [inputName]: input.value};

            const optionIndex = thisExercise.currentTask.options.indexOf(input.value);
            const option = thisExercise.currentTask.options[optionIndex] ? thisExercise.currentTask.options[optionIndex] : "";

            if(option) {
                thisExercise.prevModeValues.wordBank.completeText.completeTextP = {
                    ...thisExercise.prevModeValues.wordBank.completeText.completeTextP,
                    [inputName]: option
                };
    
                usedOptions.push(option);
            }

            thisExercise.prevModeValues.wordBank.completeText.wordBank = [];

            if(usedOptions.length > 0) thisExercise.currentTask.options.forEach(option => {
                if(usedOptions.indexOf(option) > -1) return;
                thisExercise.prevModeValues.wordBank.completeText.wordBank.push(option);
            });
        });
    }

    else {
        thisExercise.currentTask.mode.type = "write";
        if(thisExercise.currentTask.hints.status) Inputs.set(thisExercise);

        const allSpans = document.querySelectorAll(".complete-text-field");
        
        allSpans.forEach(span => {
            const fieldName = span.id.split("-")[3];
            
            if(span.classList.contains("filled-complete-text-field")) {
                thisExercise.prevModeValues.wordBank.completeText.completeTextP = {
                    ...thisExercise.prevModeValues.wordBank.completeText.completeTextP,
                    [fieldName]: span.innerText
                };

                thisExercise.prevModeValues.write.completeText = {
                    ...thisExercise.prevModeValues.write.completeText,
                    [fieldName]: span.innerText
                };
            }
        });

        let wordBankOptions = thisExercise.currentTask.options;
        const prevCompleteTextPValues = Object.values(thisExercise.prevModeValues.wordBank.completeText.completeTextP);
        wordBankOptions = wordBankOptions.filter(option => prevCompleteTextPValues.indexOf(option) === -1);

        thisExercise.prevModeValues.wordBank.completeText.wordBank = wordBankOptions;
        
        const wordBank = document.querySelector(".complete-text-word-bank");
        setTimeout(() => wordBank.remove(), 300);
    }
}