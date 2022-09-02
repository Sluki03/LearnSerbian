import PanelsList from "./list/index/PanelsList.js";
import ExercisesList from "./list/exercises/ExercisesList.js";
import SingleExercise from "./list/exercises/SingleExercise.js";
import SingleContent from "./list/exercises/SingleContent.js";
import SingleTask from "./list/exercises/SingleTask.js";
import Loading from "./list/other/Loading.js";
import Nav from "./list/other/Nav.js"
import Footer from "./list/other/Footer.js";
import InteractiveTitle from "./list/other/InteractiveTitle.js"
import ModalOptions from "./list/other/ModalOptions.js";
import ArrowButton from "./list/other/ArrowButton.js";
import { Convert } from "../functions/Convert.js";

const components = {
    PanelsList, ExercisesList, SingleExercise, SingleContent, SingleTask,
    Loading, Nav, Footer, InteractiveTitle, ModalOptions, ArrowButton
};

export const Component = { create, render };

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