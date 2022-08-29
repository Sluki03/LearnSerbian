import nav from "./list/other/nav.js"
import interactiveTitle from "./list/other/interactiveTitle.js"
import modalX from "./list/other/modalX.js";
import exercisesList from "./list/exercises/exercisesList.js";
import singleExercise from "./list/exercises/singleExercise.js";
import panelsList from "./list/index/panelsList.js";

import createElement from "../functions/createElement.js";

const components = { nav, interactiveTitle, modalX, exercisesList, singleExercise, panelsList };

export const Component = { create, render };

function create(...params) {
    let componentFunction;

    Object.keys(components).forEach((component, index) => {
        if(params[0] === component) componentFunction = Object.values(components)[index];
    });

    componentFunction(params.slice(1));
}

function render() {
    const allComponents = document.querySelectorAll("component");
    const types = [];

    for(let i = 0; i < allComponents.length; i++) types.push(cssToJsStandard(allComponents[i].classList[0]));

    for(let i = 0; i < types.length; i++) {
        switch(types[i]) {
            case "interactiveTitle": {
                const interactiveTitle = allComponents[i];
                const title = allComponents[i].dataset.title;

                for(let i = 0; i < 3; i++) createElement({
                    tag: "span",
                    innerText: title,
                    appendTo: interactiveTitle
                });

                break;
            }

            default: return;
        }
    }

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