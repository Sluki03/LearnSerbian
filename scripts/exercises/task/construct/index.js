import multipleChoice from "./multipleChoice.js";
import translate from "./translate.js";
import conversation from "./conversation/index.js";

const ConstructTypes = { multipleChoice, multipleChoiceImages: multipleChoice, translate, conversation };

export default function constructTask(task, thisTask, changeMode) {
    let constructFunction;
    
    Object.keys(ConstructTypes).forEach((key, index) => {
        if(task === key) constructFunction = Object.values(ConstructTypes)[index];
    });

    constructFunction(thisTask, changeMode);
}