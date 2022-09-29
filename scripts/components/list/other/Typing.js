import createElement from "../../../functions/createElement.js";

export default function Typing(componentProps) {
    const { builtIn } = componentProps;
    const { appendTo } = componentProps.params;

    const typingElement = builtIn ? builtIn : createElement({ tag: "div", attributes: { class: "typing" }, appendTo });

    for(let i = 0; i < 3; i++) createElement({
        tag: "div",
        attributes: { class: "typing-dot" },
        appendTo: typingElement
    });
    
    return typingElement;
}