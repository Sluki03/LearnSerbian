import multipleChoice from "./multipleChoice/index.js";
import translate from "./translate/index.js";
import conversation from "./conversation/index.js";
import connect from "./connect/index.js";
import completeText from "./completeText/index.js";
import listen from "./listen/index.js";

import translateModes from "./translate/modes.js";
import conversationModes from "./conversation/modes.js";
import completeTextModes from "./completeText/modes.js";

const ConstructTypes = {
    multipleChoice, multipleChoiceImages: multipleChoice, translate,
    conversation, connect, completeText, listen
};

const ModeTypes = { translate: translateModes, conversation: conversationModes, completeText: completeTextModes };

export function constructTask(task, thisExercise, changeMode) {
    let constructFunction;
    
    Object.keys(ConstructTypes).forEach((key, index) => {
        if(task === key) constructFunction = Object.values(ConstructTypes)[index];
    });

    constructFunction(thisExercise, changeMode);
}

let inProgress = false;

export function changeMode(task, thisExercise) {
    if(inProgress) return;
    inProgress = true;
    
    let modesFunction;

    Object.keys(ModeTypes).forEach((key, index) => {
        if(task === key) modesFunction = Object.values(ModeTypes)[index];
    });

    modesFunction(thisExercise);

    const currentInterface = document.querySelector(".interface");
    
    currentInterface.style.opacity = "0";
    currentInterface.style.top = "10px";

    setTimeout(() => {
        currentInterface.innerHTML = "";

        currentInterface.style.opacity = "0";
        currentInterface.style.top = "-10px";

        thisExercise.construct(true);

        setTimeout(() => {
            currentInterface.style.opacity = "";
            currentInterface.style.top = "";

            inProgress = false;
        }, 200);
    }, 200);
}