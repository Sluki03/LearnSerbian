import createElement from "../../../../functions/createElement.js";
import randomArray from "../../../../functions/randomArray.js";

export default function connect(thisTask) {
    const { taskHolder } = thisTask.elements;

    const connectHolder = createElement({ tag: "div", attributes: { class: "connect-holder" }, appendTo: taskHolder });
    
    for(let i = 0; i < 2; i++) createElement({
        tag: "div",
        attributes: { class: "connect-button-holder" },
        appendTo: connectHolder
    });

    const [firstButtonHolder, secondButtonHolder] = [...connectHolder.children];
    
    const randomKeys = randomArray(Object.keys(thisTask.currentTask.options));
    const randomValues = randomArray(Object.values(thisTask.currentTask.options));
    
    randomKeys.forEach(key => createElement(addButton(key, firstButtonHolder)));
    randomValues.forEach(value => createElement(addButton(value, secondButtonHolder)));

    function addButton(innerText, appendTo) {
        return {
            tag: "button",
            attributes: { class: "multiple-choice-button" },
            innerText,
            events: [{ on: "click", call: selectButton }],
            appendTo
        };
    }

    function selectButton(e) {
        e.preventDefault();

        const button = e.target;
        const parent = button.parentElement;
        
        if(button.classList.contains("active-multiple-choice-button")) {
            button.classList.remove("active-multiple-choice-button");

            [...parent.children].forEach(child => {
                if(!child.classList.contains("disabled-multiple-choice-button")) return;
                
                child.disabled = false;
                child.classList.remove("disabled-multiple-choice-button");
            });
        }

        else {
            button.classList.add("active-multiple-choice-button");

            [...parent.children].forEach(child => {
                if(child.classList.contains("active-multiple-choice-button")) return;
                
                child.disabled = true;
                child.classList.add("disabled-multiple-choice-button");
            });
        }
    }
}