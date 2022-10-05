import createElement from "../../../functions/createElement.js";
import randomArray from "../../../functions/randomArray.js";

export default function multipleChoice(thisTask) {
    const { taskHolder, taskInfo } = thisTask.elements;
    
    const multipleChoiceHolder = createElement({
        tag: "div",
        attributes: { class: `multiple-choice-holder ${thisTask.currentTask.type === "multipleChoiceImages" ? "multiple-choice-images-holder" : ""}` },
        appendTo: taskHolder
    });

    const randomOptions = randomArray(thisTask.currentTask.options);
    
    for(let i = 0; i < randomOptions.length; i++) {
        const multipleChoiceButton = createElement({
            tag: "button",
            attributes: {
                class: `multiple-choice-button ${thisTask.currentTask.type === "multipleChoiceImages" ? "multiple-choice-images-button" : ""}`,
                id: `multiple-choice-button-${i + 1}`
            },
            innerText: thisTask.currentTask.type === "multipleChoice" ? randomOptions[i] : "",
            events: [{ on: "click", call: setActiveButton }],
            appendTo: multipleChoiceHolder
        });

        if(thisTask.currentTask.type === "multipleChoice") createElement({
            tag: "span",
            attributes: { class: "multiple-choice-span" },
            innerText: i + 1,
            appendTo: multipleChoiceButton
        });

        else {
            createElement({
                tag: "img",
                attributes: {
                    src: getButtonImage(thisTask.currentTask.images, randomOptions[i]),
                    alt: randomOptions[i]
                },
                appendTo: multipleChoiceButton
            });

            createElement({
                tag: "p",
                innerText: randomOptions[i],
                appendTo: multipleChoiceButton
            });
        }
    }

    window.eventList.add({
        id: "taskFunctionsSetActiveButton",
        type: "keydown",
        listener: setActiveButton
    });

    function setActiveButton(e) {
        e.preventDefault();
        
        const taskInfoBottom = parseInt(getComputedStyle(taskInfo).getPropertyValue("bottom"));
        if(taskInfoBottom === 0) return;
    
        const id = e.type === "keydown" ? parseInt(e.key) : e.target.id.split("-")[3];
        
        if(isNaN(id) || id > randomOptions.length) return;
        
        const allButtons = document.querySelectorAll(".multiple-choice-button");
        const buttonId = `multiple-choice-button-${id}`;
    
        allButtons.forEach(button => {
            if(button.classList.contains("active-multiple-choice-button") && button.id !== buttonId) button.classList.remove("active-multiple-choice-button");
            
            if(button.id === buttonId) {
                button.classList.add("active-multiple-choice-button");
                thisTask.answerChanged(randomOptions[id - 1]);
            }
        });
    }

    function getButtonImage(images, option) {
        let result;
    
        Object.keys(images).forEach((image, index) => {
            if(image === option) result = Object.values(images)[index];
        });
    
        return result;
    }
}