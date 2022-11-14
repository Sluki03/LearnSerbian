import createElement from "../../../../functions/createElement.js";
import randomArray from "../../../../functions/randomArray.js";

export default function connect(thisExercise) {
    const { taskHolder } = thisExercise.elements;

    const connectHolder = createElement({ tag: "div", attributes: { class: "connect-holder" }, appendTo: taskHolder });
    
    for(let i = 0; i < 2; i++) createElement({
        tag: "div",
        attributes: { class: "connect-button-holder", id: `content-button-holder-${i}` },
        appendTo: connectHolder
    });

    const [firstButtonHolder, secondButtonHolder] = [...connectHolder.children];
    
    const randomKeys = randomArray(Object.keys(thisExercise.currentTask.options));
    const randomValues = randomArray(Object.values(thisExercise.currentTask.options));

    const random = randomArray([randomKeys, randomValues]);
    let buttonCount = 0;

    random.forEach((optionsArray, index) => {
        const validHolder = index === 0 ? firstButtonHolder : secondButtonHolder;
        optionsArray.forEach(option => addButton(option, validHolder));
    });

    function addButton(innerText, appendTo) {
        buttonCount++;
        
        const button = createElement({
            tag: "button",
            attributes: { class: "multiple-choice-button" },
            innerText,
            events: [{ on: "click", call: selectButton }],
            appendTo
        });

        createElement({
            tag: "span",
            innerText: buttonCount,
            appendTo: button
        });
    }

    window.eventList.add({ id: "taskConnectKeydown", type: "keydown", listener: selectButton });

    let selectStatus = false;
    
    function selectButton(e) {
        e.preventDefault();

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
        
        const button = e.type === "keydown" ? keydownButton : e.target;
        if(buttonAlreadyChecked(button) || button.disabled) return;
        
        const speakStatus = randomValues.indexOf(button.innerText.split("\n")[0]) > -1;
        
        if(
            thisExercise.currentTask.speak &&
            speakStatus &&
            !responsiveVoice.isPlaying()
        ) responsiveVoice.speak(button.innerText.split("\n")[0]);
        
        const parent = button.parentElement;
     
        if(button.classList.contains("active-multiple-choice-button")) {
            button.classList.remove("active-multiple-choice-button");
            
            button.classList.remove("first-selected-button");
            button.classList.remove("second-selected-button");

            [...parent.children].forEach(child => {
                if(!child.classList.contains("disabled-multiple-choice-button") || buttonAlreadyChecked(child)) return;
                
                child.disabled = false;
                child.classList.remove("disabled-multiple-choice-button");
            });

            if(selectStatus) selectStatus = false;
        }

        else {
            button.classList.add("active-multiple-choice-button", `${selectStatus ? "second" : "first"}-selected-button`);

            [...parent.children].forEach(child => {
                if(child.classList.contains("active-multiple-choice-button") || buttonAlreadyChecked(child)) return;
                
                child.disabled = true;
                child.classList.add("disabled-multiple-choice-button");
            });

            if(selectStatus) {
                selectStatus = false;
                checkSelection();
            }

            else selectStatus = true;
        }
    }

    function checkSelection() {
        const selectedButtons = {
            first: document.querySelector(".first-selected-button"),
            second: document.querySelector(".second-selected-button")
        }
        
        const answer = [selectedButtons.first.innerText.split("\n")[0], selectedButtons.second.innerText.split("\n")[0]];
        thisExercise.answerChanged(answer);

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
                    if(buttonAlreadyChecked(button)) return;
                    
                    if(button.classList.contains("active-multiple-choice-button")) {
                        button.disabled = true;
                        button.classList.add("disabled-multiple-choice-button", isCorrect ? "correct-button" : "wrong-button");
                        
                        button.classList.remove("active-multiple-choice-button");
                        
                        if(isCorrect) {
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
    }

    function buttonAlreadyChecked(button) {
        let status = false;
        
        if(
            button.classList.contains("correct-button") ||
            button.classList.contains("wrong-button") ||
            button.classList.contains("blocked-button")
        ) status = true;

        return status;
    }
}