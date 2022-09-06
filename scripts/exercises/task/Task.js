import { TaskFunctions } from "./TaskFunctions.js";
import { Component } from "../../components/Component.js";
import { Convert } from "../../functions/Convert.js";
import { EventParams } from "../../functions/EventParams.js";
import createElement from "../../functions/createElement.js";
import randomArray from "../../functions/randomArray.js";

export class Task {
    constructor(taskElement, exercise) {
        this.exercise = exercise;
        
        this.taskElement = taskElement;
        this.tasks = randomArray(exercise.tasks);
        this.taskNumber = 0;
        this.currentTask = this.tasks[this.taskNumber];
        this.answer = "";
        this.submitted = false;

        this.body = document.querySelector("body");
        this.elements = {};

        this.startNew = this.startNew.bind(this);
        this.check = this.check.bind(this);
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
    
    start() {
        setTimeout(() => { this.taskElement.classList.add("active-exercise-modal-task") }, 100);
        this.initializeElements();
        this.construct();
        
        const { taskH3, checkButton } = this.elements;

        taskH3.innerText = this.currentTask.title;

        checkButton.onclick = this.check;
        window.addEventListener("keydown", this.check);
    }

    startNew(e) {
        if(e.type === "keydown" && e.key !== "Enter") return;
        
        const { taskHolder, taskInfo, checkButton } = this.elements;
        const { setActiveButton } = TaskFunctions;

        window.removeEventListener("keydown", this.check);
        window.removeEventListener("keydown", setActiveButton);
        window.removeEventListener("keydown", this.startNew);
        
        taskInfo.style.bottom = "";
        checkButton.style.bottom = "";

        this.taskElement.style.opacity = "0";
        this.taskElement.style.left = "-20px";

        setTimeout(() => {
            this.taskElement.style.opacity = "";
            this.taskElement.style.left = "";
            
            this.taskElement.classList.remove("active-exercise-modal-task");

            taskHolder.innerHTML = "";
            
            if(this.tasks.length - 1 > this.taskNumber) {
                this.next();
                this.start();
            }

            else {
                this.taskElement.remove();
                
                const exerciseModal = document.querySelector(".exercise-modal");
                Component.create("ExerciseModalFinished", this.exercise, exerciseModal);
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
    
    check(e) {
        const {
            checkButton, taskInfo, taskInfoImg, taskInfoTextH4, taskInfoTextP,
            taskInfoButton
        } = this.elements;
        
        if(checkButton.classList.contains("disabled-flag-button")) return;
        if(e.type === "keydown" && e.key !== "Enter") return;

        this.submitted = true;
        
        checkButton.style.bottom = "-100px";
        
        const image = { correct: "./images/icons/circle-check.svg", incorrect: "./images/icons/circle-x.svg" };
        
        const green = { normal: "#059c20", light: "#07db2d", lighter: "#00ff2e" };
        const red = { normal: "#bd1330", light: "#d91435", lighter: "#f20707" };
        
        taskInfo.style.bottom = "0";
        
        if(this.currentTask.constructor.acceptableAnswers.indexOf(this.answer) > -1) {
            taskInfo.style.background = getLinearGradient(true);

            taskInfoImg.src = image.correct;
            
            taskInfoTextH4.innerText = this.currentTask.constructor.correct.title;
            taskInfoTextP.innerText = this.currentTask.constructor.correct.text;
        }
        
        else {
            taskInfo.style.background = getLinearGradient(false);

            taskInfoImg.src = image.incorrect;
            
            taskInfoTextH4.innerText = this.currentTask.constructor.incorrect.title;
            taskInfoTextP.innerText = this.currentTask.constructor.incorrect.text;
        }

        taskInfoButton.onclick = this.startNew;
        window.addEventListener("keydown", this.startNew);

        function getLinearGradient(isCorrect) {
            const color = isCorrect ? green : red;
            const { normal, light, lighter } = color;

            const linearGradient = `linear-gradient(135deg, ${normal} 65%, ${light} 65% 85%, ${lighter} 85%)`;
            return linearGradient;
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

                const randomOptions = randomArray(this.currentTask.constructor.options);
                
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