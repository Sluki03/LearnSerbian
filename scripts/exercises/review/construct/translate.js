import createElement from "../../../functions/createElement.js";
import setTranslatableWords from "../../setTranslatableWords.js";

export default function translate(reviewProps) {  
    const { current, taskReview } = reviewProps;
    const { task } = current;
    
    const textP = createElement({
        tag: "p",
        attributes: { class: "text-p" },
        appendTo: taskReview
    });

    setTranslatableWords(textP, task.text, task.translation, task.englishSerbian);
}