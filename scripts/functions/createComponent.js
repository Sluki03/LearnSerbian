import nav from "../components/other/nav.js";
import interactiveTitle from "../components/other/interactiveTitle.js"
import modalX from "../components/other/modalX.js";
import exercisesList from "../components/exercises/exercisesList.js";
import singleExercise from "../components/exercises/singleExercise.js";
import panelsList from "../components/index/panelsList.js";

const COMPONENTS = {
    NAV: "nav",
    INTERACTIVE_TITLE: "interactiveTitle",
    MODAL_X: "modalX",
    EXERCISES_LIST: "exercisesList",
    SINGLE_EXERCISE: "singleExercise",
    PANELS_LIST: "panelsList"
};

export default function createComponent(...params) {
    let componentFunction;
    
    switch(params[0]) {
        case COMPONENTS.NAV: {
            componentFunction = nav;
            break;
        }
        
        case COMPONENTS.INTERACTIVE_TITLE: {
            componentFunction = interactiveTitle;
            break;
        }

        case COMPONENTS.MODAL_X: {
            componentFunction = modalX;
            break;
        }

        case COMPONENTS.EXERCISES_LIST: {
            componentFunction = exercisesList;
            break;
        }

        case COMPONENTS.SINGLE_EXERCISE: {
            componentFunction = singleExercise;
            break;
        }

        case COMPONENTS.PANELS_LIST: {
            componentFunction = panelsList;
            break;
        }

        default: return;
    }

    componentFunction(params.slice(1));
}