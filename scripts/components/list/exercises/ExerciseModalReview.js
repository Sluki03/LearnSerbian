import { Component } from "../../Component.js";
import createElement from "../../../functions/createElement.js";
import markup from "../../../functions/markup.js";
import formatAnswer from "../../../exercises/task/formatAnswer.js";

export default function ExerciseModalReview(componentProps) {
    const { exercise, results, score, appendTo } = componentProps.params;
    
    const exerciseModalReview = document.querySelector("[data-template='exercise-modal-review']").content.firstElementChild.cloneNode(true);
    appendTo.appendChild(exerciseModalReview);

    setTimeout(() => { exerciseModalReview.classList.add("active-exercise-modal-review") }, 100);

    const reviewHolder = document.querySelector(".exercise-modal-review .review-holder");

    results.forEach(result => {
        const reviewTask = document.querySelector("[data-template='exercise-modal-review-task']").content.firstElementChild.cloneNode(true);
        reviewHolder.appendChild(reviewTask);

        const [reviewTaskHolder, taskExplanation] = [...reviewTask.children];
        const [reviewTaskInfo, reviewTaskStrong] = [...reviewTaskHolder.children];

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

        const blockCorrectInfoAnswers = ["conversation", "connect", "completeText"];

        const [answers, random] = formatAnswer(result.type, result.acceptableAnswers, result.userAnswer);
        
        if(result.isCorrect && blockCorrectInfoAnswers.indexOf(result.type) === -1) {
            createElement({
                tag: "p",
                innerHTML: `${(result.acceptableAnswers.length > 1 ? "Your answer" : "Answer") + (answers.user.isPlural ? "s" : "")}: "<span>${answers.user.content}</span>".`,
                appendTo: infoAnswers
            });
            
            if(random.otherCorrectAnswer) createElement({
                tag: "p",
                innerHTML: `Also correct: "<span>${random.otherCorrectAnswer}</span>".`,
                appendTo: infoAnswers
            });
        }

        else if(!result.isCorrect) {
            const nonRandomAnswerTypes = ["connect", "completeText"];
            
            createElement({
                tag: "p",
                innerHTML: `Correct answer${answers.correct.isPlural ? "s" : ""}: "<span>${nonRandomAnswerTypes.indexOf(result.type) > -1 ? answers.correct.content : random.correctAnswer}</span>".`,
                appendTo: infoAnswers
            });

            createElement({
                tag: "p",
                innerHTML: `Your answer${answers.user.isPlural ? "s" : ""}: "<span>${answers.user.content}</span>".`,
                appendTo: infoAnswers
            });

            reviewTaskStrong.remove();
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

    const continueButton = document.querySelector(".exercise-modal-review .flag-button");
    continueButton.onclick = modalOptionsReturn;
    let inProgress = false;

    window.eventList.add({ id: "exerciseModalReviewKeyDown", type: "keydown", listener: modalOptionsReturn });
    
    function modalOptionsReturn(e) {
        if(e.type === "keydown" && e.key !== "Enter") return;

        if(inProgress) return;
        inProgress = true;
        
        window.eventList.remove("exerciseModalReviewKeyDown");
        
        exerciseModalReview.classList.remove("active-exercise-modal-review");

        setTimeout(() => {
            exerciseModalReview.remove();
            Component.create("ExerciseModalFinished", { exercise, results, score, appendTo });
            inProgress = false;
        }, 300);
    }

    return exerciseModalReview;
}