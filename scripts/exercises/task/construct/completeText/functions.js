import { Shorten } from "../../../../functions/Shorten.js";

export const Inputs = {
    set: (thisTask) => {
        const allInputs = document.querySelectorAll("p input");
        const allPlaceholders = getAllPlaceholders(thisTask);
        
        allInputs.forEach((input, index) => {
            input.placeholder = allPlaceholders[index];
            Shorten.placeholder(input);
        });
    },

    reset: () => {
        const allInputs = document.querySelectorAll("p input");
        allInputs.forEach(input => { input.placeholder = "" });
    }
};

export const Spans = {
    set: (thisTask) => {
        const allSpans = document.querySelectorAll(".complete-text-field");
        const allPlaceholders = getAllPlaceholders(thisTask);
        
        allSpans.forEach((span, index) => {
            if(span.classList.contains("filled-complete-text-field")) return;
            
            span.innerText = allPlaceholders[index];
            Shorten.elementInnerText(span);
        });
    },

    reset: () => {
        const allSpans = document.querySelectorAll(".complete-text-field");
        
        allSpans.forEach(span => {
            if(span.classList.contains("filled-complete-text-field")) return;
            span.innerHTML = "&#8205;";
        });
    }
};

export function getAllPlaceholders(thisTask) {
    const allPlaceholders = [];
    getFields(thisTask).forEach(field => allPlaceholders.push(field));

    return allPlaceholders;
}

export function getFields(thisTask) {
    let innerText = thisTask.currentTask.text;
    
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

    const fields = [];
    let currentField = "";

    positions.forEach(position => {
        for(let i = position.start + 1; i < position.end; i++) currentField += innerText[i];
        
        fields.push(currentField);
        currentField = "";
    });

    return fields;
}

export function emptyFieldSelector(e) {
    const thisTask = window.eventList.getParams("taskCompleteTextKeydown");
    
    if(thisTask.answer || e.key !== "Enter") return;
    
    if(thisTask.currentTask.mode.type === "write") {
        const allInputs = document.querySelectorAll("p input");
        let targetInput = null;

        allInputs.forEach(input => {
            if(!input.value && targetInput === null) targetInput = input;
        });

        targetInput.focus();
    }

    else {
        const allSpans = document.querySelectorAll(".complete-text-field");
        
        const existingActiveCompleteTextField = document.querySelector(".active-complete-text-field");
        existingActiveCompleteTextField.classList.remove("active-complete-text-field");

        let targetField = null;

        allSpans.forEach(span => {
            if(targetField !== null || span.classList.contains("filled-complete-text-field")) return;
            targetField = span;
        });

        targetField.classList.add("active-complete-text-field");
    }
}