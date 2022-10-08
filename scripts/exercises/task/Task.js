import { Component } from "../../components/Component.js";
import { Convert } from "../../functions/Convert.js";
import createElement from "../../functions/createElement.js";
import constructTask from "./construct/index.js";
import randomArray from "../../functions/randomArray.js";
import percentage from "../../functions/percentage.js";
import breakText from "../../functions/breakText.js";

export class Task {
    constructor(taskElement, exercise) {
        this.exercise = exercise;
        this.exerciseModal = document.querySelector(".exercise-modal");
        
        this.taskElement = taskElement;
        this.numberOfTasks = exercise.numberOfTasks ? exercise.numberOfTasks > exercise.tasks.length ? exercise.tasks.length : exercise.numberOfTasks : exercise.tasks.length;
        this.tasks = randomArray(exercise.tasks, this.numberOfTasks);
        this.taskNumber = 0;
        this.messageNumber = 0;
        this.currentTask = this.tasks[this.taskNumber];
        this.prevModeValues = {
            write: {
                translate: { textareaValue: "" },
                conversation: { value: "" }
            },
            wordBank: {
                translate: { wordBank: [], textHolder: [] }
            },
            multipleChoice: {
                conversation: { classes: [] }
            }
        };

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
        this.construct = this.construct.bind(this);
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
        this.tasks = randomArray(this.exercise.tasks, this.numberOfTasks);
        this.taskNumber = 0;
        this.messageNumber = 0;
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
            this.taskLives.classList.add("active-task-lives");
            this.taskProgressBarHolder.classList.add("active-task-progress-bar-holder");

            this.taskElement.classList.add("active-exercise-modal-task");

            const taskButtonHolder = document.querySelector(".task-button-holder");
            taskButtonHolder.classList.add("active-task-button-holder");
            
            if(this.currentTask.type === "conversation") {
                const checkButton = taskButtonHolder.children[1];
                checkButton.style.display = "none";
            }
        }, 100);
        
        this.initializeElements();
        this.construct();
        
        const { taskH3, checkButton } = this.elements;

        taskH3.innerText = this.currentTask.title;

        checkButton.onclick = this.check;
        window.eventList.add({ id: "taskCheckKeyDown", type: "keydown", listener: this.check });

        this.updateLives();
    }

    startNew(e) {
        if(e?.type === "keydown" && e?.key !== "Enter") return;
        
        window.eventList.remove({ id: "taskCheckKeyDown" });
        
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
        const { taskHolder, taskInfo, taskButtonHolder, switchModesButton } = this.elements;

        window.eventList.remove("taskFunctionsSetActiveButton", "taskStartNewKeyDown");

        const progressBarP = [...this.taskProgressBarHolder.children][1];

        if(progressBarP.innerText) {
            progressBarP.style.opacity = "";

            setTimeout(() => {
                progressBarP.style.left = "";
                progressBarP.innerText = "";
            }, 300);
        }
        
        taskInfo.style.bottom = "";
        taskButtonHolder.style.bottom = "";
        
        switchModesButton.classList.remove("active-switch-modes-button");

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
        const taskButtonHolder = document.querySelector("[data-name='task-button-holder']");
        
        const taskInfo = document.querySelector("[data-name='task-info']");
        const taskInfoText = document.querySelector("[data-name='task-info-text']");
        
        const children = {
            taskElement: [...this.taskElement.children],
            taskButtonHolder: [...taskButtonHolder.children],
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
    
    check(e, additionalPass = false) {
        const { currentTask } = this;
        
        const {
            taskButtonHolder, checkButton, taskInfo, taskInfoImg, taskInfoTextH4, taskInfoTextP,
            taskInfoButton
        } = this.elements;

        const [progressBar, progressBarP] = [...this.taskProgressBarHolder.children];
        const [progressBarLine] = [...progressBar.children];

        const classPass = (checkButton !== null && !checkButton.classList.contains("disabled-flag-button")) || additionalPass;
        
        if(!classPass) return;

        const keyPass = additionalPass ? e.key === "Enter" || !isNaN(parseInt(e.key)) : e.key === "Enter";
        
        if(e.type === "keydown" && !keyPass) return;

        this.afterCheck();

        window.eventList.remove("taskCheckKeyDown");

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
        
        taskButtonHolder.style.bottom = "-100px";
        
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

        const acceptableAnswers = getAcceptableAnswers();
        const randomCorrectAnswer = acceptableAnswers[Math.floor(Math.random() * acceptableAnswers.length)];

        const text = {
            correct: "",
            incorrect: `Correct answer: "<span>${randomCorrectAnswer}</span>".`
        };

        const validText = isCorrect ? text.correct : text.incorrect;
        taskInfoTextP.innerHTML = validText;

        const audio = new Audio(`./sfx/${isCorrect ? "correct" : "wrong"}.mp3`);
        audio.play();

        if(!isCorrect) {
            this.currentLives--;
            this.updateLives();

            if(this.currentLives === 0) {
                taskInfoButton.style.display = "none";
                
                return Component.create("ClassicModal", {
                    text: "You have no more lives.",
                    buttons: ["try again", "cancel"],
                    buttonsTrigger: { tryAgain: "Enter", cancel: "Escape" },
                    functions: { tryAgain: this.startNew, cancel: this.cancel },
                    appendTo: this.exerciseModal
                });
            }
        }

        const taskResult = {
            title: currentTask.title,
            acceptableAnswers: currentTask.acceptableAnswers,
            userAnswer: this.answer,
            isCorrect,
            xp: currentTask.xp || this.exercise.defaultXP || this.defaultXP,
            explanation: currentTask.explanation || null
        };

        this.results.push(taskResult);

        taskInfoButton.onclick = this.startNew;
        window.eventList.add({ id: "taskStartNewKeyDown", type: "keydown", listener: this.startNew });

        function getLinearGradient() {
            const color = isCorrect ? green : red;
            const { normal, light, lighter } = color;

            const linearGradient = `linear-gradient(135deg, ${normal} 65%, ${light} 65% 85%, ${lighter} 85%)`;
            return linearGradient;
        }

        function getAcceptableAnswers() {
            if(currentTask.type === "conversation") {
                const conversationMessages = document.querySelector(".conversation-messages");
                const messageHolderIndex = conversationMessages.lastChild.classList.contains("participant-message-holder") ? 2 : 1;
                
                const participantMessageHolders = document.querySelectorAll(".participant-message-holder");
                
                const numberOfMessages = participantMessageHolders.length - messageHolderIndex;
                const message = currentTask.messages[numberOfMessages];

                return message.acceptableAnswers;
            }
            
            return currentTask.acceptableAnswers;
        }
    }

    isCorrect() {
        let result;
        
        switch(this.currentTask.type) {
            case "multipleChoice":
            case "multipleChoiceImages":
                result = this.currentTask.acceptableAnswers.indexOf(this.answer) > -1;
                
                break;
            case "translate":
                result = false;

                this.currentTask.acceptableAnswers.forEach(answer => {
                    if(breakText(this.answer, { join: true }) === breakText(answer, { join: true })) result = true;
                });

                break;
            case "conversation":
                result = false;
                let lastMessageAcceptableAnswers = this.currentTask.messages[this.currentTask.messages.length - 1].acceptableAnswers;

                lastMessageAcceptableAnswers.forEach(answer => {
                    if(breakText(this.answer, { join: true }) === breakText(answer, { join: true })) result = true;
                });

                break;
            default: ;
        }

        return result;
    }

    afterCheck() {
        switch(this.currentTask.type) {
            case "multipleChoice":
            case "multipleChoiceImages":
                const allButtons = document.querySelectorAll(".multiple-choice-button");
                
                allButtons.forEach(button => {
                    if(button.classList.contains("active-multiple-choice-button")) return;
                    button.classList.add("disabled-multiple-choice-button");
                });

                break;
            case "translate":
                if(this.currentTask.mode.type === "write") {
                    const translateHolderTextarea = document.querySelector(".translate-holder textarea");
                    translateHolderTextarea.disabled = true;
                }
                
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

    construct(changeMode = false) {
        constructTask(this.currentTask.type, this, changeMode);
    }

    switchModes() {
        const { currentTask, prevModeValues, construct } = this;
        const { switchModesButton } = this.elements;

        const allModes = {
            translate: ["write", "wordBank"],
            conversation: ["write", "multipleChoice"]
        };
        
        const icons = {
            write: { src: "./images/icons/write-icon.svg", alt: "Write" },
            wordBank: { src: "./images/icons/word-bank-icon.svg", alt: "Word Bank" },
            multipleChoice: { src: "./images/icons/multiple-choice-icon.svg", alt: "Multiple Choice" }
        };
        
        const taskModes = getTaskModes();
        const invertedTaskMode = currentTask.mode.type === taskModes[0] ? taskModes[1] : taskModes[0];
        const invertedIcon = getInvertedIcon();
        
        if(currentTask.mode.switch) {
            if(currentTask.mode.type === "write" && (currentTask.type === "conversation" ? this.currentTask.messages[this.messageNumber].options : currentTask.options) === undefined) return;
            
            switchModesButton.classList.add("active-switch-modes-button");
            switchModesButton.onclick = changeMode;

            const switchModesImg = document.querySelector(".active-switch-modes-button img");

            if(switchModesImg === null) createElement({
                tag: "img",
                attributes: { src: invertedIcon.src, alt: invertedIcon.alt },
                appendTo: switchModesButton
            });

            else {
                switchModesImg.src = invertedIcon.src;
                switchModesImg.alt = invertedIcon.alt;
            }
        }

        this.randomMode(taskModes);

        function changeMode() {
            if(currentTask.type === "translate") {
                if(currentTask.mode.type === "write") {
                    currentTask.mode.type = "wordBank";
    
                    const translateHolderTextarea = document.querySelector(".translate-holder textarea");
                    prevModeValues.write.translate.textareaValue = translateHolderTextarea.value;
    
                    let textHolderWords = [];
    
                    textHolderWords = translateHolderTextarea.value.split(" ");
    
                    const punctuationMarks = [".", ",", "?", "!", ":", ";"];
                    textHolderWords = textHolderWords.filter(word => punctuationMarks.indexOf(word) === -1);
    
                    for(let i = 0; i < textHolderWords.length; i++) textHolderWords[i] = textHolderWords[i].toLowerCase();
    
                    const words = {
                        textHolder: [],
                        wordBank: []
                    };
    
                    textHolderWords.forEach(word => {
                        if(currentTask.options.indexOf(word) > -1) words.textHolder.push(word);
                    });
    
                    currentTask.options.forEach(option => {
                        if(words.textHolder.indexOf(option) === -1) words.wordBank.push(option);
                    });
    
                    prevModeValues.wordBank.translate = words;
                }
                
                else {
                    currentTask.mode.type = "write";
    
                    const words = {
                        textHolder: [],
                        wordBank: []
                    };
    
                    const textHolder = document.querySelector(".text-holder");
                    const wordsBankOptionsHolder = document.querySelector(".word-bank-options-holder");
                    
                    [...textHolder.children].forEach(child => {
                        const childText = child.innerText;
                        words.textHolder.push(childText);
                    });
    
                    [...wordsBankOptionsHolder.children].forEach(child => {
                        const childText = child.innerText;
                        words.wordBank.push(childText);
                    });
    
                    prevModeValues.wordBank.translate = words;
                    prevModeValues.write.translate.textareaValue = words.textHolder.join(" ");
                }
            }

            if(currentTask.type === "conversation") {
                const conversationAnswerInput = document.querySelector(".conversation-answer input");
                const conversationAnswerButtonHolder = document.querySelector(".conversation-answer-button-holder");

                if(currentTask.mode.type === "write") {
                    currentTask.mode.type = "multipleChoice";
                    prevModeValues.write.conversation.value = conversationAnswerInput.value;
                }

                else {
                    currentTask.mode.type = "write";
                    
                    const classes = [];

                    [...conversationAnswerButtonHolder.children].forEach(child => {      
                        [...child.classList].forEach(className => {
                            if(className === "multiple-choice-button") return;
                            classes.push(className);
                        });
                    });

                    prevModeValues.multipleChoice.conversation.classes = classes;
                }
            }

            const currentInterface = document.querySelector(".interface");
            currentInterface.innerHTML = "";

            construct(true);
        }

        function getTaskModes() {
            let result;

            Object.keys(allModes).forEach((key, index) => {
                if(currentTask.type === key) result = Object.values(allModes)[index];
            });

            return result;
        }

        function getInvertedIcon() {
            let result;
            
            Object.keys(icons).forEach((key, index) => {
                if(invertedTaskMode === key) result = Object.values(icons)[index];
            });

            return result;
        }
    }

    randomMode(taskModes) {
        if(this.currentTask.mode.type === "random") {
            const randomModeType = taskModes[Math.floor(Math.random() * taskModes.length)];
            const optionsRequired = ["wordBank", "multipleChoice"];

            const optionsProp = this.currentTask.type === "conversation" ? this.currentTask.messages[this.messageNumber].options : this.currentTask.options;
            
            if(optionsRequired.indexOf(randomModeType) > -1 && optionsProp === undefined) this.currentTask.mode.type = "write";
            else this.currentTask.mode.type = randomModeType;
        }
    }
}