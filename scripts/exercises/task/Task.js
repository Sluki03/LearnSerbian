import { TaskFunctions } from "./TaskFunctions.js";
import { Component } from "../../components/Component.js";
import { Convert } from "../../functions/Convert.js";
import { EventParams } from "../../functions/EventParams.js";
import createElement from "../../functions/createElement.js";
import randomArray from "../../functions/randomArray.js";

export class Task {
    constructor(taskElement, exercise) {
        this.exercise = exercise;
        this.exerciseModal = document.querySelector(".exercise-modal");
        
        this.taskElement = taskElement;
        this.tasks = randomArray(exercise.tasks, exercise.numberOfTasks);
        this.taskNumber = 0;
        this.currentTask = this.tasks[this.taskNumber];
        this.answer = "";
        this.submitted = false;
        this.results = [];

        this.currentLives = this.exercise.lives;
        this.taskLives = document.querySelector(".task-lives");

        this.progressBar = { value: 0, increase: 100 / this.tasks.length, inRow: 0 };
        this.taskProgressBarHolder = document.querySelector(".task-progress-bar-holder");

        this.body = document.querySelector("body");
        this.elements = {};

        this.startNew = this.startNew.bind(this);
        this.cancel = this.cancel.bind(this);
        this.clearTaskElements = this.clearTaskElements.bind(this);
        this.check = this.check.bind(this);
        this.afterCheck = this.afterCheck.bind(this);
        this.answerChanged = this.answerChanged.bind(this);
    }

    next() {
        this.taskNumber++;
        this.currentTask = this.tasks[this.taskNumber];
        this.answer = "";
        this.answerChanged(this.answer);
        this.submitted = false;
        this.elements = {};
    }

    reset() {
        this.taskNumber = 0;
        this.currentTask = this.tasks[this.taskNumber];
        this.answer = "";
        this.submitted = false;
        this.results = [];
        this.currentLives = this.exercise.lives;
        this.progressBar = { value: 0, increase: 100 / this.tasks.length, inRow: 0 };
        this.elements = {};

        const [progressBar] = [...this.taskProgressBarHolder.children];
        const [progressBarLine] = [...progressBar.children];

        progressBarLine.style.width = "";
    }
    
    start() {
        setTimeout(() => {
            this.taskElement.classList.add("active-exercise-modal-task");
            this.taskLives.classList.add("active-task-lives");
            this.taskProgressBarHolder.classList.add("active-task-progress-bar-holder");
        }, 100);
        
        this.initializeElements();
        this.construct();
        
        const { taskH3, checkButton } = this.elements;

        taskH3.innerText = this.currentTask.title;

        checkButton.onclick = this.check;
        window.addEventListener("keydown", this.check);

        this.updateLives();
    }

    startNew(e) {
        if(e?.type === "keydown" && e?.key !== "Enter") return;
        
        if(this.tasks.length - 1 === this.taskNumber) {
            this.taskLives.classList.remove("active-task-lives");
            this.taskProgressBarHolder.classList.remove("active-task-progress-bar-holder");
        }

        this.clearTaskElements(false);

        setTimeout(() => {
            if(this.currentLives === 0) {
                this.reset();
                this.start();
            }
            
            else if(this.tasks.length - 1 > this.taskNumber) {
                this.next();
                this.start();
            }

            else {
                this.taskLives.remove();
                this.taskProgressBarHolder.remove();
                this.taskElement.remove();
                
                Component.create("ExerciseModalFinished", { exercise: this.exercise, results: this.results, appendTo: this.exerciseModal });
            }
        }, 300);
    }

    cancel() {
        this.taskLives.classList.remove("active-task-lives");
        this.taskProgressBarHolder.classList.remove("active-task-progress-bar-holder");

        this.clearTaskElements(true);
    }

    clearTaskElements(removeElements) {
        const { taskHolder, taskInfo, checkButton } = this.elements;
        const { setActiveButton } = TaskFunctions;

        window.removeEventListener("keydown", setActiveButton);
        window.removeEventListener("keydown", this.startNew);

        const progressBarP = [...this.taskProgressBarHolder.children][1];

        if(progressBarP.innerText) {
            progressBarP.style.opacity = "";

            setTimeout(() => {
                progressBarP.style.left = "";
                progressBarP.innerText = "";
            }, 300);
        }
        
        taskInfo.style.bottom = "";
        checkButton.style.bottom = "";

        this.taskElement.style.opacity = "0";
        this.taskElement.style.left = "-20px";

        setTimeout(() => {
            this.taskElement.style.opacity = "";
            this.taskElement.style.left = "";
            
            this.taskElement.classList.remove("active-exercise-modal-task");

            taskHolder.innerHTML = "";

            if(removeElements) {
                this.taskLives.remove();
                this.taskProgressBarHolder.remove();
                this.taskElement.remove();

                const exerciseModalContent = Component.create("ExerciseModalContent", {
                    exercise: this.exercise,
                    appendTo: this.exerciseModal,
                    style: { opacity: "0", left: "20px" }
                });

                const exerciseModalTitle = document.querySelector(".exercise-modal-title");
                const exerciseModalDivider = document.querySelector(".divider");

                exerciseModalTitle.style.opacity = "0";
                exerciseModalTitle.style.top = "-10px";

                exerciseModalDivider.style.opacity = "0";
                exerciseModalDivider.style.top = "-10px";

                setTimeout(() => {
                    exerciseModalContent.style.opacity = "";
                    exerciseModalContent.style.left = "";

                    exerciseModalTitle.style.opacity = "";
                    exerciseModalTitle.style.top = "";

                    exerciseModalDivider.style.opacity = "";
                    exerciseModalDivider.style.top = "";
                }, 300);
            }
        }, 300);
    }

    initializeElements() {
        const taskInfo = document.querySelector("[data-name='task-info']");
        const taskInfoText = document.querySelector("[data-name='task-info-text']");
        
        const children = {
            taskElement: [...this.taskElement.children],
            taskInfo: [...taskInfo.children],
            taskInfoText: [...taskInfoText.children]
        };
        
        Object.values(children).forEach(childArray => {
            let newElements = {};
            
            childArray.forEach(child => {
                const key = Convert.cssToJsStandard(child.dataset.name);
                newElements = {...newElements, [key]: child};
            });

            this.elements = {...this.elements, ...newElements};
        });
    }

    updateLives() {
        this.taskLives.innerHTML = "";
        
        for(let i = 0; i < this.currentLives; i++) createElement({
            tag: "img",
            attributes: { src: "./images/icons/lives-icon.png", alt: "LIVE" },
            appendTo: this.taskLives
        });
    }
    
    check(e) {
        const { currentTask } = this;
        
        const {
            checkButton, taskInfo, taskInfoImg, taskInfoTextH4, taskInfoTextP,
            taskInfoButton
        } = this.elements;

        const [progressBar, progressBarP] = [...this.taskProgressBarHolder.children];
        const [progressBarLine] = [...progressBar.children];
        
        if(checkButton.classList.contains("disabled-flag-button")) return;
        if(e.type === "keydown" && e.key !== "Enter") return;

        this.afterCheck();

        window.removeEventListener("keydown", this.check);

        const isCorrect = currentTask.acceptableAnswers.indexOf(this.answer) > -1;

        if(isCorrect) this.progressBar.inRow++;
        else this.progressBar.inRow = 0;

        this.submitted = true;

        this.progressBar.value += this.progressBar.increase;

        progressBarLine.style.width = `${this.progressBar.value}%`;
        progressBarLine.style.backgroundColor = "#0589f5";

        progressBarLine.style.boxShadow = "30px 0 0 #f20707";

        if(this.progressBar.inRow > 1) {
            progressBarP.innerText = `${this.progressBar.inRow} in a row!`;
            
            progressBarP.style.opacity = "1";
            progressBarP.style.left = `${this.progressBar.value / 2}%`;
        }

        setTimeout(() => {
            if(this.progressBar.value < 100) progressBarLine.style.backgroundColor = "";
            progressBarLine.style.boxShadow = "";
        }, 300);

        if(!isCorrect) {
            this.currentLives--;
            this.updateLives();

            if(this.currentLives === 0) return Component.create("ClassicModal", {
                text: "You have no more lives.",
                buttons: ["try again", "cancel"],
                functions: { tryAgain: this.startNew, cancel: this.cancel },
                appendTo: this.exerciseModal
            });
        }
        
        checkButton.style.bottom = "-100px";
        
        const image = { correct: "./images/icons/circle-check.svg", incorrect: "./images/icons/circle-x.svg" };
        
        const green = { normal: "#059c20", light: "#07db2d", lighter: "#00ff2e" };
        const red = { normal: "#bd1330", light: "#d91435", lighter: "#f20707" };
        
        taskInfo.style.bottom = "0";

        taskInfo.style.background = getLinearGradient();
        taskInfoImg.src = isCorrect ? image.correct : image.incorrect;

        const correctTitles = ["correct", "good job", "very well", "nice", "excellent"];
        const incorrectTitles = ["incorrect", "wrong", "false", "mistake", "think again"];
        const validTitles = isCorrect ? correctTitles : incorrectTitles;

        taskInfoTextH4.innerText = `${validTitles[Math.floor(Math.random() * validTitles.length)]}!`;

        const randomCorrectAnswer = currentTask.acceptableAnswers[Math.floor(Math.random() * currentTask.acceptableAnswers.length)];

        const text = {
            correct: {},
            incorrect: { multipleChoice: `Correct answer: <span>${randomCorrectAnswer}</span>.` }
        };

        const validText = isCorrect ? text.correct : text.incorrect;
        taskInfoTextP.innerHTML = getText();

        const taskResult = {
            title: currentTask.title,
            acceptableAnswers: currentTask.acceptableAnswers,
            userAnswer: this.answer,
            isCorrect: currentTask.acceptableAnswers.indexOf(this.answer) > -1,
            explanation: currentTask.explanation || null
        };

        this.results.push(taskResult);

        taskInfoButton.onclick = this.startNew;
        window.addEventListener("keydown", this.startNew);

        function getLinearGradient() {
            const color = isCorrect ? green : red;
            const { normal, light, lighter } = color;

            const linearGradient = `linear-gradient(135deg, ${normal} 65%, ${light} 65% 85%, ${lighter} 85%)`;
            return linearGradient;
        }

        function getText() {
            let result = "";
            
            Object.keys(validText).forEach((key, index) => {
                if(currentTask.type === key) result = Object.values(validText)[index];
            });

            return result;
        }
    }

    afterCheck() {
        switch(this.currentTask.type) {
            case "multipleChoice":
                const allButtons = document.querySelectorAll(".multiple-choice-button");
                
                allButtons.forEach(button => {
                    if(button.classList.contains("active-multiple-choice-button")) return;
                    button.classList.add("disabled-multiple-choice-button");
                });

                break;
            default: ;
        }
    }

    answerChanged(newAnswer) {
        const { checkButton } = this.elements;
        
        this.answer = newAnswer;

        if(this.answer) checkButton.classList.remove("disabled-flag-button");
        else if(!checkButton.classList.contains("disabled-flag-button")) checkButton.classList.add("disabled-flag-button");
    }

    construct() {
        const { answerChanged } = this;
        const { taskHolder } = this.elements;
        const { setActiveButton } = TaskFunctions;
        
        switch(this.currentTask.type) {
            case "multipleChoice": {
                const multipleChoiceHolder = createElement({
                    tag: "div",
                    attributes: { class: "multiple-choice-holder" },
                    appendTo: taskHolder
                });

                const randomOptions = randomArray(this.currentTask.options);
                
                for(let i = 0; i < randomOptions.length; i++) {
                    const multipleChoiceButton = createElement({
                        tag: "button",
                        attributes: { class: "multiple-choice-button", id: `multiple-choice-button-${i + 1}` },
                        innerText: randomOptions[i],
                        events: [{ on: "click", call: setActiveButton }],
                        appendTo: multipleChoiceHolder
                    });

                    createElement({
                        tag: "span",
                        attributes: { class: "multiple-choice-span" },
                        innerText: i + 1,
                        appendTo: multipleChoiceButton
                    });
                }

                EventParams.set("setActiveButton", { randomOptions, answerChanged });
                window.addEventListener("keydown", setActiveButton);
                
                break;
            }
            
            default: return;
        }
    }
}