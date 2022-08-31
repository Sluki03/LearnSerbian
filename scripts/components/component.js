import panelsList from "./list/index/panelsList.js";
import exercisesList from "./list/exercises/exercisesList.js";
import singleExercise from "./list/exercises/singleExercise.js";
import singleContent from "./list/exercises/singleContent.js";
import singleTask from "./list/exercises/singleTask.js";
import loading from "./list/other/loading.js";
import nav from "./list/other/nav.js"
import footer from "./list/other/footer.js";
import interactiveTitle from "./list/other/interactiveTitle.js"
import modalOptions from "./list/other/modalOptions.js";

const components = {
    panelsList, exercisesList, singleExercise, singleContent, singleTask,
    loading, nav, footer, interactiveTitle, modalOptions
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