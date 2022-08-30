import nav from "./list/other/nav.js"
import interactiveTitle from "./list/other/interactiveTitle.js"
import modalX from "./list/other/modalX.js";
import exercisesList from "./list/exercises/exercisesList.js";
import singleExercise from "./list/exercises/singleExercise.js";
import panelsList from "./list/index/panelsList.js";

const components = { nav, interactiveTitle, modalX, exercisesList, singleExercise, panelsList };

export const Component = { create, render };

function create(...params) {
    let componentFunction;

    Object.keys(components).forEach((component, index) => {
        if(params[0] === component) componentFunction = Object.values(components)[index];
    });

    const componentProps = { builtIn: null, params: params.slice(1) };
    componentFunction(componentProps);
}

function render() {
    const componentElements = document.querySelectorAll("[data-component]");
    const componentTypes = [];

    for(let i = 0; i < componentElements.length; i++) componentTypes.push(cssToJsStandard(componentElements[i].dataset.component));

    componentTypes.forEach((componentType, index) => {
        let componentFunction;
        
        Object.keys(components).forEach((component, componentIndex) => {
            if(componentType === component) componentFunction = Object.values(components)[componentIndex];
        });

        const datasetParams = Object.values(componentElements[index].dataset).slice(1);

        const componentProps = { builtIn: componentElements[index], params: datasetParams };
        componentFunction(componentProps);
    });

    function cssToJsStandard(string) {
        let newString = "";
        let upperCaseStatus = false;

        for(let i = 0; i < string.length; i++) {
            if(upperCaseStatus) {
                upperCaseStatus = false;
                newString += string[i].toUpperCase();
            }

            else if(string[i] === "-") upperCaseStatus = true;
            else newString += string[i];
        }

        return newString;
    }
}