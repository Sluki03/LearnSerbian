import { Component } from "../../../components/Component.js";
import createElement from "../../../functions/createElement.js";

export default function multipleChoice(reviewProps) {
    const { current, taskReview } = reviewProps;
    const { task, result } = current;
    
    const markedOptions = [];

    task.options.forEach(option => {
        const conditions = {
            correct: task.acceptableAnswers.indexOf(option) > -1,
            userCorrect: result.userAnswer === option
        };
        
        if(conditions.correct && conditions.userCorrect) markedOptions.push(`<span><u>${option}</u></span>`);
        else if(conditions.correct) markedOptions.push(`<span>${option}</span>`);
        else if(conditions.userCorrect) markedOptions.push(`<u>${option}</u>`);
        
        else markedOptions.push(option);
    });

    if(task.type !== "multipleChoiceImages") {
        if(task.type === "multipleChoiceOfImage") Component.create("OptionImage", {
            image: task.image,
            appendTo: taskReview
        });
        
        createElement({
            tag: "p",
            innerHTML: `<span>Options:</span> ${markedOptions.join(", ")}.`,
            appendTo: taskReview
        });
    }

    else {
        const optionsHolder = createElement({
            tag: "div",
            attributes: { class: "options-holder" },
            appendTo: taskReview
        });

        createElement({
            tag: "p",
            innerHTML: "<span>Options:</span>",
            appendTo: optionsHolder
        });

        const optionsImagesHolder = createElement({
            tag: "div",
            attributes: { class: "options-images-holder" },
            appendTo: optionsHolder
        });

        task.options.forEach(option => {
            let validImage = "";

            Object.keys(task.images).forEach((key, index) => {
                if(option === key) validImage = Object.values(task.images)[index];
            });

            const optionImage = Component.create("OptionImage", {
                image: validImage,
                text: option,
                appendTo: optionsImagesHolder
            });

            if(result.userAnswer === option) optionImage.classList.add("option-image-user");
            if(task.acceptableAnswers.indexOf(option) > -1) optionImage.classList.add("option-image-correct");
        });
    }
}