import createElement from "../../../../functions/createElement.js";

export default function completeText(thisTask) {
    const { taskHolder } = thisTask.elements;

    const completeTextHolder = createElement({
        tag: "div",
        attributes: { class: "complete-text-holder" },
        appendTo: taskHolder
    });

    const text = createElement({
        tag: "p",
        innerText: thisTask.currentTask.text,
        appendTo: completeTextHolder
    });

    let innerText = text.innerText;
    let inputValues = {};

    getInputs().forEach((input, index) => {
        const inputName = Object.keys(thisTask.currentTask.acceptableAnswers)[index];
        
        const inputTemplate = `<input
            type='text'
            placeholder='${inputName}'
            id="complete-input-${inputName}"
        >`;

        innerText = innerText.replace(`<${input}>`, inputTemplate);
        inputValues = {...inputValues, [inputName]: ""};
    });

    text.innerHTML = innerText;

    const allInputs = document.querySelectorAll("p input");

    allInputs.forEach(input => {
        const inputName = input.id.split("-")[2];
        
        input.oninput = () => {
            inputValues = {...inputValues, [inputName]: input.value};
            thisTask.answerChanged(inputValues);
        }
    });

    function getInputs() {
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

        const inputs = [];
        let currentInput = "";

        positions.forEach(position => {
            for(let i = position.start + 1; i < position.end; i++) currentInput += innerText[i];
            
            inputs.push(currentInput);
            currentInput = "";
        });

        return inputs;
    }
}