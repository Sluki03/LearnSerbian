import multipleChoice from "./multipleChoice/index.js";
import translate from "./translate/index.js";
import conversation from "./conversation/index.js";
import connect from "./connect/index.js";
import completeText from "./completeText/index.js";

import translateModes from "./translate/modes.js";
import conversationModes from "./conversation/modes.js";
import completeTextModes from "./completeText/modes.js";

const ConstructTypes = { multipleChoice, multipleChoiceImages: multipleChoice, translate, conversation, connect, completeText };
const ModeTypes = { translate: translateModes, conversation: conversationModes, completeText: completeTextModes };

export function constructTask(task, thisTask, changeMode) {
    let constructFunction;
    
    Object.keys(ConstructTypes).forEach((key, index) => {
        if(task === key) constructFunction = Object.values(ConstructTypes)[index];
    });

    constructFunction(thisTask, changeMode);
}

let inProgress = false;

export function changeMode(task, thisTask) {
    if(inProgress) return;
    inProgress = true;
    
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

            inProgress = false;
        }, 200);
    }, 200);
}