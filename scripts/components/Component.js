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
import ClassicModal from "./list/other/ClassicModal.js";
import { Convert } from "../functions/Convert.js";

const components = {
    PanelsList, ExercisesList, ExerciseModal, ExerciseModalContent, ExerciseModalTask,
    ExerciseModalFinished, ExerciseModalReview, Loading, Nav, Footer,
    InteractiveTitle, ModalOptions, ArrowButton, ClassicModal
};

export const Component = { create, render, update };

function create(componentName, params, isUpdate) {
    let componentInfo;

    Object.keys(components).forEach((component, index) => {
        if(componentName === component) componentInfo = {
            name: component,
            function: Object.values(components)[index]
        };
    });

    const componentProps = { builtIn: null, params, firstRender: isUpdate ? true : !isUpdate };
    const newComponent = componentInfo.function(componentProps);

    newComponent.component = { name: componentInfo.name, params };

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
        let componentInfo;
        
        Object.keys(components).forEach((component, componentIndex) => {
            if(componentType === component) componentInfo = {
                name: component,
                function: Object.values(components)[componentIndex]
            };
        });
        
        const { dataset } = componentElements[index];
        let validDataset = {};

        Object.keys(dataset).forEach((key, index) => {
            if(key === "component") return;
            validDataset = {...validDataset, [key]: Object.values(dataset)[index]};
        });

        const componentProps = { builtIn: componentElements[index], params: validDataset };

        const newComponent = componentInfo.function(componentProps);
        newComponent.component = { name: componentInfo.name, params: validDataset };
    });
}

function update(componentElement, newParams) {
    const component = componentElement.component;
    const { name, params } = component;

    const parent = componentElement.parentNode;

    componentElement.remove();
    return create(name, {...params, ...newParams, appendTo: parent}, true);
}