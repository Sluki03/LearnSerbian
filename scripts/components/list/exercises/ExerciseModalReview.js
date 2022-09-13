import { Component } from "../../Component.js";
import createElement from "../../../functions/createElement.js";
import markup from "../../../functions/markup.js";

export default function ExerciseModalReview(componentProps) {
    const { exercise, results, score, appendTo } = componentProps.params;

    const exerciseModalReview = document.querySelector("[data-template='exercise-modal-review']").content.firstElementChild.cloneNode(true);
    appendTo.appendChild(exerciseModalReview);

    const modalOptions = document.querySelector(".modal-options");
    const updatedModalOptions = Component.update(modalOptions, {
        options: ["return", "resize", "x"],
        functions: {...modalOptions.component.params.functions, return: modalOptionsReturn},
        resizeId: modalOptions.children[0].id ? "active-modal-resize" : ""
    });

    setTimeout(() => { exerciseModalReview.classList.add("active-exercise-modal-review") }, 100);

    const reviewHolder = document.querySelector(".exercise-modal-review .review-holder");

    results.forEach(result => {
        const reviewTask = document.querySelector("[data-template='exercise-modal-review-task']").content.firstElementChild.cloneNode(true);
        reviewHolder.appendChild(reviewTask);

        const [reviewTaskHolder, taskExplanation] = [...reviewTask.children];
        const [reviewTaskInfo] = [...reviewTaskHolder.children];

        const green = { normal: "#059c20", light: "#07db2d", lighter: "#00ff2e" };
        const red = { normal: "#bd1330", light: "#d91435", lighter: "#f20707" };

        const validColor = result.isCorrect ? green : red;
        const { normal, light, lighter } = validColor;

        const linearGradient = `linear-gradient(135deg, ${normal} 65%, ${light} 65% 85%, ${lighter} 85%)`;
        reviewTask.style.background = linearGradient;

        const validImage = result.isCorrect ? "./images/icons/circle-check.svg" : "./images/icons/circle-x.svg";

        createElement({
            tag: "img",
            attributes: { src: validImage, alt: result.isCorrect ? "CORRECT" : "INCORRECT" },
            appendTo: reviewTaskHolder,
            before: reviewTaskInfo
        });
        
        const [infoStrong, infoAnswers] = [...reviewTaskInfo.children]; 

        infoStrong.innerText = result.title;

        if(result.isCorrect) {
            createElement({
                tag: "p",
                innerHTML: `Answer: <span>${result.userAnswer}</span>.`,
                appendTo: infoAnswers
            });
            
            if(result.acceptableAnswers.length > 1) {
                let otherAnswers = result.acceptableAnswers;
                otherAnswers = otherAnswers.filter(answer => answer !== result.userAnswer);

                createElement({
                    tag: "p",
                    innerHTML: `Answer: <span>${otherAnswers[Math.floor(Math.random() * otherAnswers.length)]}</span>.`,
                    appendTo: infoAnswers
                });
            }
        }

        else {
            const randomCorrectAnswer = result.acceptableAnswers[Math.floor(Math.random() * result.acceptableAnswers.length)];
            
            createElement({
                tag: "p",
                innerHTML: `Correct answer: <span>${randomCorrectAnswer}</span>.`,
                appendTo: infoAnswers
            });

            createElement({
                tag: "p",
                innerHTML: `Your answer: <span>${result.userAnswer}</span>.`,
                appendTo: infoAnswers
            });
        }

        if(result.explanation) {
            Component.render(taskExplanation);

            const [explanationTitle, explanationP] = [...taskExplanation.children];
            const [titleButton] = [...explanationTitle.children];

            explanationTitle.onclick = () => {
                const titleButtonTransform = getComputedStyle(titleButton).getPropertyValue("transform");
                
                if(titleButtonTransform === "none") {
                    titleButton.style.transform = "rotate(180deg)";

                    explanationP.innerHTML = markup(result.explanation);
                    explanationP.classList.add("active-explanation-p");
                }
                

                else {
                    titleButton.style.transform = "";
                    explanationP.classList.remove("active-explanation-p");

                    setTimeout(() => { explanationP.innerHTML = "" }, 300);
                }
            }
        }
        
        else taskExplanation.remove();
    });

    function modalOptionsReturn() {
        exerciseModalReview.classList.remove("active-exercise-modal-review");

        setTimeout(() => {
            exerciseModalReview.remove();
            Component.create("ExerciseModalFinished", { exercise, results, score, appendTo });
            
            Component.update(updatedModalOptions, {
                options: null,
                functions: {...updatedModalOptions.component.params.functions, return: null},
                resizeId: updatedModalOptions.children[1].id ? "active-modal-resize" : ""
            });
        }, 300);
    }

    return exerciseModalReview;
}