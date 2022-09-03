import { EventParams } from "../../functions/EventParams.js";

export const TaskFunctions = { setActiveButton };

function setActiveButton(e) {
    e.preventDefault();
    
    const setActiveButtonParams = EventParams.get("setActiveButton");
    const { randomOptions, answerChanged, submitted } = setActiveButtonParams;

    if(submitted) return;

    const id = e.type === "keydown" ? parseInt(e.key) : e.target.id.split("-")[3];
    
    if(isNaN(id) || id > randomOptions) return;
    
    const allButtons = document.querySelectorAll(".multiple-choice-button");
    const buttonId = `multiple-choice-button-${id}`;

    allButtons.forEach(button => {
        if(button.classList.contains("active-multiple-choice-button") && button.id !== buttonId) button.classList.remove("active-multiple-choice-button");
        
        if(button.id === buttonId) {
            button.classList.add("active-multiple-choice-button");
            answerChanged(randomOptions[id - 1]);
        }
    });
}