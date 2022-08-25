import interactiveTitle from "./other/interactiveTitle.js"
import modalX from "./other/modalX.js";
import exercisesList from "./exercises/exercisesList.js";
import singleExercise from "./exercises/singleExercise.js";

const components = {
    INTERACTIVE_TITLE: "interactiveTitle",
    MODAL_X: "modalX",
    EXERCISES_LIST: "exercisesList",
    SINGLE_EXERCISE: "singleExercise"
};

export default function createComponent(...params) {
    let componentFunction;
    
    switch(params[0]) {
        case components.INTERACTIVE_TITLE: {
            componentFunction = interactiveTitle;
            break;
        }

        case components.MODAL_X: {
            componentFunction = modalX;
            break;
        }

        case components.EXERCISES_LIST: {
            componentFunction = exercisesList;
            break;
        }

        case components.SINGLE_EXERCISE: {
            componentFunction = singleExercise;
            break;
        }

        default: return;
    }

    componentFunction(params.slice(1));
}