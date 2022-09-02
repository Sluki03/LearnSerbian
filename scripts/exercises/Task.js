import { Convert } from "../functions/Convert.js";
import createElement from "../functions/createElement.js";

export class Task {
    constructor(taskElement, tasks) {
        this.taskElement = taskElement;
        this.tasks = tasks;
        this.taskNumber = 0;
        this.currentTask = this.tasks[this.taskNumber];
        this.answer = "";

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

    startNew() {
        const { taskHolder, taskInfo, checkButton } = this.elements;
        
        taskInfo.style.bottom = "";
        checkButton.style.bottom = "";

        window.removeEventListener("keydown", this.check);
        this.body.onkeydown = null;

        this.taskElement.style.opacity = "0";
        this.taskElement.style.left = "-20px";

        setTimeout(() => {
            this.taskElement.style.opacity = "";
            this.taskElement.style.left = "";
            
            this.taskElement.classList.remove("active-exercise-modal-task");

            taskHolder.innerHTML = "";

            this.next();
            this.start();
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
    
    check(event) {        
        const {
            checkButton, taskInfo, taskInfoImg, taskInfoTextH4, taskInfoTextP,
            taskInfoButton
        } = this.elements;
        
        if(event.type === "click" && checkButton.classList.contains("disabled-flag-button")) return;
        if(event.type === "keydown" && event.key !== "Enter") return;

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
        const { currentTask, answerChanged } = this;
        const { taskHolder } = this.elements;
        
        switch(this.currentTask.type) {
            case "multipleChoice": {
                const multipleChoiceHolder = createElement({
                    tag: "div",
                    attributes: { class: "multiple-choice-holder" },
                    appendTo: taskHolder
                });
                
                for(let i = 0; i < this.currentTask.constructor.options.length; i++) {
                    const multipleChoiceButton = createElement({
                        tag: "button",
                        attributes: { class: "multiple-choice-button", id: `multiple-choice-button-${i + 1}` },
                        innerText: this.currentTask.constructor.options[i],
                        events: [{ on: "click", call: () => setActiveButton(i + 1) }],
                        appendTo: multipleChoiceHolder
                    });

                    createElement({
                        tag: "span",
                        attributes: { class: "multiple-choice-span" },
                        innerText: i + 1,
                        appendTo: multipleChoiceButton
                    });
                }

                this.body.onkeydown = e => setActiveButton(parseInt(e.key));

                function setActiveButton(id) {
                    if(isNaN(id) || id > currentTask.constructor.options.length) return;
                    
                    const allButtons = document.querySelectorAll(".multiple-choice-button");
                    const buttonId = `multiple-choice-button-${id}`;

                    allButtons.forEach(button => {
                        if(button.classList.contains("active-multiple-choice-button") && button.id !== buttonId) button.classList.remove("active-multiple-choice-button");
                        
                        if(button.id === buttonId) {
                            button.classList.add("active-multiple-choice-button");
                            answerChanged(currentTask.constructor.options[id - 1]);
                        }
                    });
                }
                
                break;
            }
            
            default: return;
        }
    }
}