import createElement from "../../../functions/createElement.js";
import markup from "../../../functions/markup.js";

export default function explanation(reviewProps) {
    const { current, taskReview } = reviewProps;
    const { result } = current;
    
    if(!result.explanation) return;

    const explanationHolder = createElement({
        tag: "div",
        attributes: { class: "explanation-holder" },
        appendTo: taskReview
    });

    createElement({
        tag: "strong",
        innerText: "Explanation:",
        appendTo: explanationHolder
    });

    createElement({
        tag: "p",
        innerHTML: markup(result.explanation),
        appendTo: explanationHolder
    });
}