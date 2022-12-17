import { Convert } from "../../../functions/Convert.js";
import createElement from "../../../functions/createElement.js";

export default function connect(reviewProps) {
    const { current, taskReview } = reviewProps;
    const { task, result } = current;
    
    const connectHolder = createElement({
        tag: "div",
        attributes: { class: "connect-holder" },
        appendTo: taskReview
    });

    let connection = null;
    
    for(let i = 0; i < 2; i++) {
        connection = createElement({
            tag: "div",
            attributes: { class: "connection" },
            appendTo: connectHolder
        });

        if(!i) Object.keys(result.userAnswer.scheme).forEach((key, index) => addOption(key, index + 1));
    
        else Object.keys(result.userAnswer.scheme).forEach(key => {
            const connectionOfKey = getConnection(key);
            let order = 0;

            Object.values(result.userAnswer.scheme).forEach((value, index) => {
                if(connectionOfKey === value) order = index + 1;
            });

            addOption(connectionOfKey, order + 4);
        });
    }

    function addOption(buttonContent, spanContent) {
        const buttonId = `connect-${Convert.cssToJsStandard(buttonContent.replaceAll(" ", "-"))}`;
        
        const button = createElement({
            tag: "div",
            attributes: { class: "multiple-choice-button", id: buttonId },
            innerText: buttonContent,
            appendTo: connection
        });

        createElement({
            tag: "span",
            innerText: spanContent,
            appendTo: button
        });
    }

    function getConnection(selection) {
        let result = "";
        const isKey = Object.keys(task.options).indexOf(selection) > -1;

        if(isKey) Object.keys(task.options).forEach((key, index) => {
            if(selection === key) result = Object.values(task.options)[index];
        });

        else Object.values(task.options).forEach((value, index) => {
            if(selection === value) result = Object.keys(task.options)[index];
        });

        return result;
    }
}