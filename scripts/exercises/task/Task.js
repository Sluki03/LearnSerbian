import { TaskFunctions } from "./TaskFunctions.js";
import { Component } from "../../components/Component.js";
import { Convert } from "../../functions/Convert.js";
import { EventParams } from "../../functions/EventParams.js";
import createElement from "../../functions/createElement.js";
import randomArray from "../../functions/randomArray.js";
import percentage from "../../functions/percentage.js";
import breakText from "../../functions/breakText.js";

export class Task {
    constructor(taskElement, exercise) {
        this.exercise = exercise;
        this.exerciseModal = document.querySelector(".exercise-modal");
        
        this.taskElement = taskElement;
        this.numberOfTasks = exercise.numberOfTasks || exercise.tasks.length;
        this.tasks = randomArray(exercise.tasks, this.numberOfTasks);
        this.taskNumber = 0;
        this.currentTask = this.tasks[this.taskNumber];

        this.answer = "";
        this.defaultXP = 10;
        this.score = { xp: 0, mistakes: 0 };

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
        this.isCorrect = this.isCorrect.bind(this);
        this.afterCheck = this.afterCheck.bind(this);
        this.calculateScore = this.calculateScore.bind(this);
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
        this.answerChanged(this.answer);
        this.submitted = false;
        this.results = [];
        this.score = { xp: 0, mistakes: 0 };
        this.currentLives = this.exercise.lives;
        this.progressBar = { value: 0, increase: 100 / this.tasks.length, inRow: 0 };
        this.elements = {};
        
        const [progressBar] = [...this.taskProgressBarHolder.children];
        const [progressBarLine] = [...progressBar.children];

        progressBarLine.style.width = "";
        progressBarLine.style.boxShadow = "none";
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
        
        if(this.tasks.length - 1 === this.taskNumber && this.currentLives > 0) {
            this.taskLives.classList.remove("active-task-lives");
            this.taskProgressBarHolder.classList.remove("active-task-progress-bar-holder");
        }

        this.clearTaskElements(false);

        setTimeout(() => {
            const { taskInfoButton } = this.elements;
            taskInfoButton.style.display = "";
            
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
                
                Component.create("ExerciseModalFinished", {
                    exercise: this.exercise,
                    results: this.results,
                    score: {...this.score, correct: parseInt(percentage(this.numberOfTasks, this.numberOfTasks - this.score.mistakes))},
                    appendTo: this.exerciseModal
                });
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
                    style: { opacity: "0", left: "20px" },
                    titleStyle: { opacity: "0", top: "-10px" }
                });

                setTimeout(() => {
                    exerciseModalContent.style.opacity = "";
                    exerciseModalContent.style.left = "";
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

        const isCorrect = this.isCorrect();

        if(isCorrect) this.progressBar.inRow++;
        else this.progressBar.inRow = 0;

        this.submitted = true;

        this.calculateScore(isCorrect);

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
            
            incorrect: {
                multipleChoice: `Correct answer: <span>${randomCorrectAnswer}</span>.`,
                multipleChoiceImages: `Correct answer: <span>${randomCorrectAnswer}</span>.`
            }
        };

        const validText = isCorrect ? text.correct : text.incorrect;
        taskInfoTextP.innerHTML = getText();

        const audio = new Audio(`../../../sfx/${isCorrect ? "correct" : "wrong"}.mp3`);
        audio.play();

        if(!isCorrect) {
            this.currentLives--;
            this.updateLives();

            if(this.currentLives === 0) {
                taskInfoButton.style.display = "none";
                
                return Component.create("ClassicModal", {
                    text: "You have no more lives.",
                    buttons: ["try again", "cancel"],
                    functions: { tryAgain: this.startNew, cancel: this.cancel },
                    appendTo: this.exerciseModal
                });
            }
        }

        const taskResult = {
            title: currentTask.title,
            acceptableAnswers: currentTask.acceptableAnswers,
            userAnswer: this.answer,
            isCorrect: currentTask.acceptableAnswers.indexOf(this.answer) > -1,
            xp: currentTask.xp || this.exercise.defaultXP || this.defaultXP,
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

    isCorrect() {
        let result;
        
        switch(this.currentTask.type) {
            case "multipleChoice":
            case "multipleChoiceImages": {
                result = this.currentTask.acceptableAnswers.indexOf(this.answer) > -1;
                break;
            }

            case "translate": {
                let correctStatus = false;

                this.currentTask.acceptableAnswers.forEach(answer => {
                    if(breakText(this.answer, { join: true }) === breakText(answer, { join: true })) correctStatus = true;
                });

                result = correctStatus;

                break;
            }
        }

        return result;
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

    calculateScore(isCorrect) {
        const scoreScheme = this.score;

        if(isCorrect) {
            let xpSource = this.currentTask.xp || this.exercise.defaultXP || this.defaultXP;
            scoreScheme.xp += xpSource;
        }

        else scoreScheme.mistakes++;

        this.score = scoreScheme;
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
        const { setActiveButton, getButtonImage, setTranslatableWords } = TaskFunctions;
        
        switch(this.currentTask.type) {
            case "multipleChoice":
            case "multipleChoiceImages": {
                const multipleChoiceHolder = createElement({
                    tag: "div",
                    attributes: { class: `multiple-choice-holder ${this.currentTask.type === "multipleChoiceImages" ? "multiple-choice-images-holder" : ""}` },
                    appendTo: taskHolder
                });

                const randomOptions = randomArray(this.currentTask.options);
                
                for(let i = 0; i < randomOptions.length; i++) {
                    const multipleChoiceButton = createElement({
                        tag: "button",
                        attributes: {
                            class: `multiple-choice-button ${this.currentTask.type === "multipleChoiceImages" ? "multiple-choice-images-button" : ""}`,
                            id: `multiple-choice-button-${i + 1}`
                        },
                        innerText: this.currentTask.type === "multipleChoice" ? randomOptions[i] : "",
                        events: [{ on: "click", call: setActiveButton }],
                        appendTo: multipleChoiceHolder
                    });

                    if(this.currentTask.type === "multipleChoice") createElement({
                        tag: "span",
                        attributes: { class: "multiple-choice-span" },
                        innerText: i + 1,
                        appendTo: multipleChoiceButton
                    });

                    else {
                        createElement({
                            tag: "img",
                            attributes: {
                                src: getButtonImage(this.currentTask.images, randomOptions[i]),
                                alt: randomOptions[i]
                            },
                            appendTo: multipleChoiceButton
                        });

                        createElement({
                            tag: "p",
                            innerText: randomOptions[i],
                            appendTo: multipleChoiceButton
                        });
                    }
                }

                EventParams.set("setActiveButton", { randomOptions, answerChanged });
                window.addEventListener("keydown", setActiveButton);
                
                break;
            }

            case "translate": {
                const translateHolder = createElement({
                    tag: "div",
                    attributes: { class: "translate-holder" },
                    appendTo: taskHolder
                });
                
                const translateHolderP = createElement({
                    tag: "p",
                    appendTo: translateHolder
                });

                setTranslatableWords(translateHolderP, this.currentTask.text, this.currentTask.translation);

                const translateHolderTextarea = createElement({
                    tag: "textarea",
                    attributes: {
                        rows: 4,
                        cols: 2,
                        type: "text",
                        placeholder: "Write the translation...",
                        maxLength: 200
                    },
                    events: [
                        { on: "input", call: () => answerChanged(translateHolderTextarea.value) },
                        { on: "keydown", call: e => { if(e.key === "Enter") e.preventDefault(); } }
                    ],
                    appendTo: translateHolder
                });

                break;
            }
            
            default: return;
        }
    }
}