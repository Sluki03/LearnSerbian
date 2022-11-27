import createElement from "../../../functions/createElement.js";

export default function TrophyCounter(componentProps) {
    const { builtIn } = componentProps;
    const { appendTo } = componentProps.params;

    const trophyCounter = builtIn ? builtIn : createElement({
        tag: "div",
        attributes: { class: "trophy-holder" },
        appendTo
    });

    createElement({
        tag: "img",
        attributes: { src: "./images/icons/trophy-icon.png" },
        appendTo: trophyCounter
    });

    createElement({
        tag: "p",
        appendTo: trophyCounter
    });

    return trophyCounter;
}