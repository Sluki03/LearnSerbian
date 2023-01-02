import createElement from "../../../../functions/createElement.js";
import randomArray from "../../../../functions/randomArray.js";
import inputKeydown from "../../../../functions/inputKeydown.js";

export default function connect(thisExercise) {
    const { taskHolder } = thisExercise.elements;

    let selectStatus = false;
    let safeTry = true;
    
    const connectOption = {
        add: (innerText, appendTo) => {
            buttonCount++;
        
            const button = createElement({
                tag: "button",
                attributes: { class: "multiple-choice-button" },
                innerText,
                events: [{ on: "click", call: connectOption.select }],
                appendTo
            });

            createElement({
                tag: "span",
                innerText: buttonCount,
                appendTo: button
            });
        },

        select: e => {
            if(!inputKeydown(e)) e.preventDefault();

            const validButtons = ["Escape"];

            for(let i = 1; i <= buttonCount; i++) validButtons.push(i.toString());
            if(e.type === "keydown" && validButtons.indexOf(e.key) === -1) return;

            const keydownId = parseInt(e.key);
            let keydownButton = null;

            if(e.key === "Escape") {
                [...firstButtonHolder.children].forEach(child => {
                    if(child.classList.contains("active-multiple-choice-button")) keydownButton = child;
                });

                if(keydownButton === null) return;
            }

            else {
                const allButtons = document.querySelectorAll(".multiple-choice-button");
                keydownButton = allButtons[keydownId - 1];
            }
            
            const button = e.type === "keydown" ? keydownButton : e.currentTarget;
            if(connectOption.alreadyChecked(button) || button.disabled) return;
            
            const speakStatus = randomValues.indexOf(button.innerText.split("\n")[0]) > -1;
            
            if(thisExercise.currentTask.speak && speakStatus) responsiveVoice.speak(button.innerText.split("\n")[0]);
            
            const parent = button.parentElement;
        
            if(button.classList.contains("active-multiple-choice-button")) {
                button.classList.remove("active-multiple-choice-button");
                
                button.classList.remove("first-selected-button");
                button.classList.remove("second-selected-button");

                [...parent.children].forEach(child => {
                    if(!child.classList.contains("disabled-multiple-choice-button") || connectOption.alreadyChecked(child)) return;
                    
                    child.disabled = false;
                    child.classList.remove("disabled-multiple-choice-button");
                });

                if(selectStatus) selectStatus = false;
            }

            else {
                button.classList.add("active-multiple-choice-button", `${selectStatus ? "second" : "first"}-selected-button`);

                [...parent.children].forEach(child => {
                    if(child.classList.contains("active-multiple-choice-button") || connectOption.alreadyChecked(child)) return;
                    
                    child.disabled = true;
                    child.classList.add("disabled-multiple-choice-button");
                });

                if(selectStatus) {
                    selectStatus = false;
                    connectOption.check();
                }

                else selectStatus = true;
            }
        },

        check: () => {
            const selectedButtons = {
                first: document.querySelector(".first-selected-button"),
                second: document.querySelector(".second-selected-button")
            }
            
            const answer = [selectedButtons.first.innerText.split("\n")[0], selectedButtons.second.innerText.split("\n")[0]];
            const { connectScheme } = window.eventList.getParams("taskConnectKeydown");

            thisExercise.answerChanged({ answer, scheme: connectScheme });
    
            let isCorrect = false;
    
            const answerKey = thisExercise.currentTask.options.hasOwnProperty(answer[0]) ? answer[0] : answer[1];
            const answerValue = answerKey === answer[0] ? answer[1] : answer[0];
            
            Object.keys(thisExercise.currentTask.options).forEach((key, index) => {
                if(answerKey === key) {
                    const value = Object.values(thisExercise.currentTask.options)[index];
                    if(answerValue === value) isCorrect = true;
                }
            });
    
            applyResult();
    
            if(!isCorrect) {
                if(safeTry) return safeTry = false;
                
                window.eventList.remove("taskConnectKeydown");
                thisExercise.check({ type: "click" });
            }
    
            let taskCompleted = true;
            const buttonHolders = [firstButtonHolder, secondButtonHolder];
    
            buttonHolders.forEach(buttonHolder => {
                [...buttonHolder.children].forEach(button => {
                    if(!button.classList.contains("disabled-multiple-choice-button")) taskCompleted = false;
                    if(!isCorrect) button.classList.add("disabled-multiple-choice-button", "blocked-button");
                });
            });
    
            if(taskCompleted) {
                window.eventList.remove("taskConnectKeydown");
                thisExercise.check({ type: "click" });
            }
    
            function applyResult() {
                const buttonHolders = [firstButtonHolder, secondButtonHolder];
    
                buttonHolders.forEach(buttonHolder => {
                    [...buttonHolder.children].forEach(button => {
                        if(connectOption.alreadyChecked(button)) return;
                        
                        if(button.classList.contains("active-multiple-choice-button")) {
                            button.disabled = true;
                            button.classList.add("disabled-multiple-choice-button", isCorrect ? "correct-button" : "wrong-button");
                            
                            if(safeTry && !isCorrect) setTimeout(() => {
                                button.disabled = false;
                                button.classList.remove("disabled-multiple-choice-button", isCorrect ? "correct-button" : "wrong-button");
                            }, 300);

                            button.classList.remove("active-multiple-choice-button");
                            
                            if(safeTry || isCorrect) {
                                button.classList.remove("first-selected-button");
                                button.classList.remove("second-selected-button");
                            }
                        }
        
                        else {
                            button.disabled = false;
                            button.classList.remove("disabled-multiple-choice-button");
                        }
                    });
                });
            }
        },

        alreadyChecked: button => {
            let status = false;
        
            if(
                button.classList.contains("correct-button") ||
                button.classList.contains("wrong-button") ||
                button.classList.contains("blocked-button")
            ) status = true;

            return status;
        }
    };
    
    const connectHolder = createElement({ tag: "div", attributes: { class: "connect-holder" }, appendTo: taskHolder });
    
    for(let i = 0; i < 2; i++) createElement({
        tag: "div",
        attributes: { class: "connect-button-holder", id: `content-button-holder-${i + 1}` },
        appendTo: connectHolder
    });

    const [firstButtonHolder, secondButtonHolder] = [...connectHolder.children];
    
    const randomKeys = randomArray(Object.keys(thisExercise.currentTask.options));
    const randomValues = randomArray(Object.values(thisExercise.currentTask.options));

    const random = randomArray([randomKeys, randomValues]);
    
    let buttonCount = 0;

    random.forEach((optionsArray, index) => {
        const validHolder = index ? secondButtonHolder : firstButtonHolder;
        optionsArray.forEach(option => connectOption.add(option, validHolder));
    });

    let connectScheme = {};
    formatConnectSchemeObject();

    window.eventList.add({
        id: "taskConnectKeydown",
        type: "keydown",
        listener: connectOption.select,
        params: { connectScheme }
    });

    function formatConnectSchemeObject() {
        const connectButtonHolders = document.querySelectorAll(".connect-button-holder");
        const connectButtonHoldersValues = { keys: [], values: [] };
        
        setConnectButtonHoldersValues("keys");
        setConnectButtonHoldersValues("values");

        connectButtonHoldersValues.keys.forEach((key, index) => {
            let schemeObject = {};
            const value = connectButtonHoldersValues.values[index];

            schemeObject = { [key]: value };
            connectScheme = {...connectScheme, ...schemeObject};
        });

        function setConnectButtonHoldersValues(prop) {
            const validHolder = connectButtonHoldersValues.keys.length === 0 ? 0 : 1;
            const connectButtonHolderClone = connectButtonHolders[validHolder].cloneNode(true);
            
            [...connectButtonHolderClone.children].forEach(button => {
                const span = button.children[0];
                span.remove();
                
                const validProp = prop === "keys" ? connectButtonHoldersValues.keys : connectButtonHoldersValues.values;
                validProp.push(button.innerText);
            });
        }
    }
}