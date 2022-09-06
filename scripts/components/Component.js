import PanelsList from "./list/index/PanelsList.js";
import ExercisesList from "./list/exercises/ExercisesList.js";
import ExerciseModal from "./list/exercises/ExerciseModal.js";
import ExerciseModalContent from "./list/exercises/ExerciseModalContent.js";
import ExerciseModalTask from "./list/exercises/ExerciseModalTask.js";
import ExerciseModalFinished from "./list/exercises/ExerciseModalFinished.js";
import ExerciseModalReview from "./list/exercises/ExerciseModalReview.js";
import Loading from "./list/other/Loading.js";
import Nav from "./list/other/Nav.js"
import Footer from "./list/other/Footer.js";
import InteractiveTitle from "./list/other/InteractiveTitle.js"
import ModalOptions from "./list/other/ModalOptions.js";
import ArrowButton from "./list/other/ArrowButton.js";
import { Convert } from "../functions/Convert.js";

const components = {
    PanelsList, ExercisesList, ExerciseModal, ExerciseModalContent, ExerciseModalTask,
    ExerciseModalFinished, ExerciseModalReview, Loading, Nav, Footer,
    InteractiveTitle, ModalOptions, ArrowButton
};

export const Component = { create, render, update };

function create(...params) {
    let componentFunction;

    Object.keys(components).forEach((component, index) => {
        if(params[0] === component) componentFunction = Object.values(components)[index];
    });

    const componentProps = { builtIn: null, params: params.slice(1) };
    const newComponent = componentFunction(componentProps);

    return newComponent;
}

function render(element) {
    const selectIn = element ? element : document;
    
    const componentElements = selectIn.querySelectorAll("[data-component]");
    const componentTypes = [];

    for(let i = 0; i < componentElements.length; i++) {
        const componentType = Convert.cssToJsStandard(componentElements[i].dataset.component);
        const validComponentType = componentType[0].toUpperCase() + componentType.substring(1);

        componentTypes.push(validComponentType);
    }

    componentTypes.forEach((componentType, index) => {
        let componentFunction;
        
        Object.keys(components).forEach((component, componentIndex) => {
            if(componentType === component) componentFunction = Object.values(components)[componentIndex];
        });

        const datasetParams = Object.values(componentElements[index].dataset).slice(1);

        const componentProps = { builtIn: componentElements[index], params: datasetParams };
        componentFunction(componentProps);
    });
}

function update(...params) {
    const componentElement = params[0];
    const componentParent = componentElement.parentNode;
    const componentClone = componentElement.cloneNode(true);

    componentElement.remove();

    const componentName = Convert.cssToJsStandard(componentClone.dataset.component);
    const validComponentType = componentName[0].toUpperCase() + componentName.substring(1);
    
    Component.create(validComponentType, componentParent, params[1]);
}