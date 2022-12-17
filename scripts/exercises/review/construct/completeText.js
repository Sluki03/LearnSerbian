import { Convert } from "../../../functions/Convert.js";
import createElement from "../../../functions/createElement.js";
import breakText from "../../../functions/breakText.js";
import setTranslatableWords from "../../setTranslatableWords.js";

export default function completeText(reviewProps) {
    const { current, taskReview } = reviewProps;
    const { task, result } = current;
    
    let validText = task.text;

    Object.keys(result.userAnswer).forEach((key, index) => {
        const values = {
            correct: Object.values(task.acceptableAnswers)[index],
            user: Object.values(result.userAnswer)[index]
        };

        let isCorrect = false;

        values.correct.forEach(correctValue => {
            if(breakText(values.user, { join: true }) === breakText(correctValue, { join: true })) isCorrect = true;
        });
        
        const jsToCssWrittenKey = Convert.jsToCssStandard(key);
        
        validText = validText.replaceAll(
            `<${jsToCssWrittenKey.replaceAll("-", " ")}>`,
            `<strong class="${isCorrect ? "correct-answer" : "incorrect-answer"}" id="complete-text-${key}">${values.user}</strong>`
        );
    });

    const textP = createElement({
        tag: "p",
        attributes: { class: "text-p" },
        appendTo: taskReview
    });

    setTranslatableWords(textP, validText, task.translation, task.englishSerbian);
}