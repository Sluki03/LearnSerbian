import multipleChoice from "./multipleChoice/index.js";
import translate from "./translate/index.js";
import conversation from "./conversation/index.js";

import translateModes from "./translate/modes.js";
import conversationModes from "./conversation/modes.js";

const ConstructTypes = { multipleChoice, multipleChoiceImages: multipleChoice, translate, conversation };
const ModeTypes = { translate: translateModes, conversation: conversationModes };

export function constructTask(task, thisTask, changeMode) {
    let constructFunction;
    
    Object.keys(ConstructTypes).forEach((key, index) => {
        if(task === key) constructFunction = Object.values(ConstructTypes)[index];
    });

    constructFunction(thisTask, changeMode);
}

export function changeMode(task, thisTask) {
    let modesFunction;

    Object.keys(ModeTypes).forEach((key, index) => {
        if(task === key) modesFunction = Object.values(ModeTypes)[index];
    });

    modesFunction(thisTask);

    const currentInterface = document.querySelector(".interface");
    
    currentInterface.style.opacity = "0";
    currentInterface.style.top = "10px";

    setTimeout(() => {
        currentInterface.innerHTML = "";

        currentInterface.style.opacity = "0";
        currentInterface.style.top = "-10px";

        thisTask.construct(true);

        setTimeout(() => {
            currentInterface.style.opacity = "";
            currentInterface.style.top = "";
        }, 200);
    }, 200);
}