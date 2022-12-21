import { loadingTipsData } from "../../../../data/loadingTipsData.js";
import createElement from "../../../functions/createElement.js";

export default function Loading(componentProps) {
    const { builtIn } = componentProps;
    const { tips, style, appendTo } = componentProps.params;

    const loadingElement = builtIn ? builtIn : createElement({
        tag: "div",
        attributes: { class: "loading" },
        style,
        appendTo
    });

    const circleHolder = createElement({
        tag: "div",
        attributes: { class: "circle-holder" },
        appendTo: loadingElement
    });

    for(let i = 0; i < 2; i++) {
        const circle = createElement({
            tag: "div",
            attributes: { class: "circle", id: `loading-circle-${i + 1}` },
            appendTo: circleHolder
        });

        createElement({
            tag: "div",
            attributes: { class: "circle-loader" },
            appendTo: circle
        });

        createElement({
            tag: "div",
            attributes: { class: "circle-top-border" },
            appendTo: circle
        });

        createElement({
            tag: "div",
            attributes: { class: "circle-bottom-border" },
            appendTo: circle
        });
    }

    if(tips) createElement({
        tag: "p",
        innerText: loadingTipsData[Math.floor(Math.random() * loadingTipsData.length)],
        appendTo: loadingElement
    });

    const body = document.querySelector("body");
    body.style.overflow = "hidden";

    return loadingElement;
}
