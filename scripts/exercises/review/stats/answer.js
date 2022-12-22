import { Component } from "../../../components/Component.js";
import { Convert } from "../../../functions/Convert.js";
import createElement from "../../../functions/createElement.js";
import formatAnswer from "../../formatAnswer.js";

export default function answer(reviewProps) {
    const { current, taskReview } = reviewProps;
    const { task, result } = current;
    
    const answerInfo = createElement({
        tag: "div",
        attributes: { class: "answer-info" },
        appendTo: taskReview
    });

    switch(task.type) {
        case "multipleChoiceImages":
            if(!result.isCorrect) {
                createElement({
                    tag: "p",
                    innerHTML: "<span>Correct answer:</span>",
                    appendTo: answerInfo
                });

                let validImage = "";

                Object.keys(task.images).forEach((key, index) => {
                    if(task.acceptableAnswers.indexOf(key) > -1) validImage = Object.values(task.images)[index];
                });
                
                Component.create("OptionImage", {
                    image: validImage,
                    text: task.acceptableAnswers[0],
                    appendTo: answerInfo
                });
            }
        
            createElement({
                tag: "p",
                innerHTML: `<span>${result.isCorrect ? "Answer" : "Your answer"}:</span>`,
                appendTo: answerInfo
            });

            let validImage = "";

            Object.keys(task.images).forEach((key, index) => {
                if(result.userAnswer === key) validImage = Object.values(task.images)[index];
            });
            
            Component.create("OptionImage", {
                image: validImage,
                text: result.userAnswer,
                appendTo: answerInfo
            });

            break;
        case "connect":
            if(!result.isCorrect) {
                createElement({
                    tag: "p",
                    innerHTML: "<span>Correct answer:</span>",
                    appendTo: answerInfo
                });

                const acceptableAnswersHolder = createElement({
                    tag: "div",
                    attributes: { class: "acceptable-answers-holder" },
                    appendTo: answerInfo
                });

                result.acceptableAnswers.forEach(answer => {
                    const answerClone = document.getElementById(`connect-${Convert.cssToJsStandard(answer.replaceAll(" ", "-"))}`).cloneNode(true);
                    acceptableAnswersHolder.appendChild(answerClone);
                });
            }
        
            createElement({
                tag: "p",
                innerHTML: `<span>${result.isCorrect ? "Answer" : "Your answer"}:</span>`,
                appendTo: answerInfo
            });

            const userAnswersHolder = createElement({
                tag: "div",
                attributes: { class: "user-answers-holder" },
                appendTo: answerInfo
            });
            
            result.userAnswer.answer.forEach(answer => {
                const answerClone = document.getElementById(`connect-${Convert.cssToJsStandard(answer.replaceAll(" ", "-"))}`).cloneNode(true);
                userAnswersHolder.appendChild(answerClone);
            });

            break;
        case "completeText":
            if(result.isCorrect) return;
        
            const answerArrowHolder = createElement({
                tag: "div",
                attributes: { class: "answer-arrow-holder" },
                appendTo: answerInfo
            });
            
            createElement({
                tag: "img",
                attributes: { src: "./images/icons/arrow-down-icon.png", alt: "ARROW-DOWN", class: "arrow-down" },
                appendTo: answerArrowHolder
            });

            const completeTextP = document.querySelector(".complete-text-review .text-p").cloneNode(true);
            
            const correctAnswers = completeTextP.querySelectorAll(".correct-answer");
            const incorrectAnswers = completeTextP.querySelectorAll(".incorrect-answer");

            correctAnswers.forEach(correctAnswer => {
                correctAnswer.classList.remove("correct-answer");
                correctAnswer.style.fontWeight = "normal";
            });
            
            incorrectAnswers.forEach(incorrectAnswer => {
                incorrectAnswer.classList.remove("incorrect-answer");
                incorrectAnswer.classList.add("correct-answer");

                const acceptableAnswer = getAcceptableAnswer(incorrectAnswer.id.split("-")[2]);
                incorrectAnswer.innerText = acceptableAnswer[Math.floor(Math.random() * acceptableAnswer.length)];
            });

            createElement({
                tag: "p",
                attributes: { class: "text-p" },
                innerHTML: completeTextP.innerHTML,
                appendTo: answerArrowHolder
            });

            function getAcceptableAnswer(acceptableKey) {
                let result = [];

                Object.keys(task.acceptableAnswers).forEach((key, index) => {
                    if(acceptableKey === key) result = Object.values(task.acceptableAnswers)[index];
                });

                return result;
            }
        
            break;
        default: defaultAnswerStats();
    }

    function defaultAnswerStats() {
        const validUserAnswer = Array.isArray(result.userAnswer) ? result.userAnswer[result.userAnswer.length - 1] : result.userAnswer;
        const [answers, random] = formatAnswer(result.type, result.acceptableAnswers, validUserAnswer);
                
        if(result.isCorrect) {
            const yourAnswerText = `<span>${(result.acceptableAnswers.length > 1 ? "Your answer" : "Answer") + (answers.user.isPlural ? "s" : "")}:</span>`
            
            createElement({
                tag: "p",
                innerHTML: `${yourAnswerText} "${answers.user.content}"`,
                appendTo: answerInfo
            });
                    
            if(random.otherCorrectAnswer) createElement({
                tag: "p",
                innerHTML: `<span>Also correct:</span> "${random.otherCorrectAnswer}"`,
                appendTo: answerInfo
            });
        }

        else {                        
            const correctAnswerText = `<span>Correct answer${answers.correct.isPlural ? "s" : ""}:</span>`;
            const yourAnswerText = `<span>Your answer${answers.user.isPlural ? "s" : ""}:</span>`;

            createElement({
                tag: "p",
                innerHTML: `${correctAnswerText} "${random.correctAnswer}"`,
                appendTo: answerInfo
            });

            createElement({
                tag: "p",
                innerHTML: `${yourAnswerText} "${answers.user.content}"`,
                appendTo: answerInfo
            });
        }
    }
}