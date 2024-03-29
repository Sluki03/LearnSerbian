import { Component } from "../../components/Component.js";
import { Convert } from "../../functions/text/Convert.js";
import { Percentage } from "../../functions/calc/Percentage.js";
import createElement from "../../functions/element/createElement.js";
import { constructTask, changeMode } from "./construct/index.js";
import randomArray from "../../functions/other/randomArray.js";
import breakText from "../../functions/text/breakText.js";
import formatAnswer from "../formatAnswer.js";
import formatTime from "../../functions/calc/formatTime.js";
import getDefaultTitle from "../getDefaultTitle.js";

export class Exercise {
    constructor(exerciseElement, exercise) {
        this.exercise = exercise;
        this.exerciseModal = document.querySelector(".exercise-modal");
        
        this.exerciseElement = exerciseElement;
        this.numberOfTasks = exercise.numberOfTasks ? exercise.numberOfTasks > exercise.tasks.length ? exercise.tasks.length : exercise.numberOfTasks : exercise.tasks.length;
        this.tasks = randomArray(exercise.tasks, this.numberOfTasks);
        this.taskNumber = 0;
        this.messageNumber = 0;
        this.currentTask = this.tasks[this.taskNumber];
        this.prevModeValues = {
            write: {
                translate: { textareaValue: "" },
                conversation: { value: "" },
                completeText: {}
            },
            wordBank: {
                translate: { wordBank: [], textHolder: [] },
                completeText: { wordBank: [], completeTextP: {}  }
            },
            multipleChoice: {
                conversation: { classes: [] }
            }
        };

        this.answer = "";
        this.defaultXP = 10;
        this.score = { xp: 0, mistakes: 0, taskTimes: [] };

        this.submitted = false;
        this.results = [];

        this.currentLives = this.exercise.lives || "infinity";
        this.taskLives = document.querySelector(".task-lives");

        this.progressBar = { value: 0, increase: 100 / this.tasks.length, inRow: 0 };
        this.taskProgressBarHolder = document.querySelector(".task-progress-bar-holder");

        this.body = document.querySelector("body");
        this.elements = {};

        this.livesLoaded = false;
        this.voicesLoaded = false;

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
        this.score = { xp: 0, mistakes: 0, taskTimes: [] };
        this.livesLoaded = false;
        this.currentLives = this.exercise.lives || "infinity";
        this.progressBar = { value: 0, increase: 100 / this.tasks.length, inRow: 0 };
        this.elements = {};
        
        const [progressBar] = [...this.taskProgressBarHolder.children];
        const [progressBarLine] = [...progressBar.children];

        progressBarLine.style.width = "";
        progressBarLine.style.boxShadow = "none";
    }
    
    async start() {
        if(!this.voicesLoaded) await this.loadVoices();
        this.voicesLoaded = true;

        const exerciseModalTask = document.querySelector(".exercise-modal-task");
        exerciseModalTask.id = "extended-exercise-modal-task";
        
        setTimeout(() => {
            this.taskLives.classList.add("active-task-lives");
            this.taskProgressBarHolder.classList.add("active-task-progress-bar-holder");

            this.exerciseElement.classList.add("active-exercise-modal-task");

            const taskButtonHolder = document.querySelector(".task-button-holder");

            const checkButton = taskButtonHolder.children[1];
            const blockedCheckButton = ["conversation", "connect"];
            
            if(blockedCheckButton.indexOf(this.currentTask.type) > -1) {
                taskButtonHolder.style.bottom = "5px";
                checkButton.style.display = "none";
            }

            else {
                taskButtonHolder.style.bottom = "15px";
                checkButton.style.display = "";
            }
        }, 100);
        
        this.initializeElements();
        this.construct();
        
        const { taskH3, checkButton } = this.elements;

        taskH3.innerText = this.currentTask.title || getDefaultTitle(this.currentTask.type);

        checkButton.onclick = this.check;
        window.eventList.add({ id: "taskCheckKeyDown", type: "keydown", listener: this.check });

        this.updateLives(true);
        this.score = {...this.score, taskTimes: [...this.score.taskTimes, new Date().getTime()]};
    }

    startNew(e) {
        if(e?.type === "keydown" && e?.key !== "Enter") return;
        responsiveVoice.pause();

        window.eventList.remove("taskCheckKeyDown");
        
        if(this.tasks.length - 1 === this.taskNumber && (this.currentLives > 0 || this.currentLives === "infinity")) {
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
                this.exerciseElement.remove();
                
                Component.create("ExerciseModalFinished", {
                    exercise: this.exercise,
                    results: this.results,
                    score: {
                        ...this.score,
                        correct: parseInt(Percentage.calc(this.numberOfTasks, this.numberOfTasks - this.score.mistakes)),
                        time: formatTime(new Date().getTime() - this.score.taskTimes[0])
                    },
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

        this.exerciseElement.style.opacity = "0";
        this.exerciseElement.style.left = "-20px";

        setTimeout(() => {
            this.exerciseElement.style.opacity = "";
            this.exerciseElement.style.left = "";
            
            this.exerciseElement.classList.remove("active-exercise-modal-task");

            taskHolder.innerHTML = "";
            taskHolder.style.height = "";

            if(removeElements) {
                this.taskLives.remove();
                this.taskProgressBarHolder.remove();
                this.exerciseElement.remove();

                const exerciseModalContent = Component.create("ExerciseModalTask", {
                    exercise: this.exercise,
                    appendTo: this.exerciseModal
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
            exerciseElement: [...this.exerciseElement.children],
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

    updateLives(start = false) {
        const { exercise, taskLives, currentLives } = this;
        
        if(!start) {
            const liveLines = document.querySelectorAll(".task-lives-line");
            
            if(this.currentLives < liveLines.length) {
                const heartStrong = document.querySelector(".heart-holder strong");
                const targetLiveLine = liveLines[liveLines.length - 1];
                
                heartStrong.style.opacity = "0";
                heartStrong.style.top = "60%";
                
                targetLiveLine.style.width = "0";
                targetLiveLine.style.opacity = "0";

                setTimeout(setLives, 300);
            }
        }

        else {
            setLives();

            if(!this.livesLoaded) {
                this.livesLoaded = true;
                
                const heartHolder = document.querySelector(".heart-holder");
                const livesLineHolder = document.querySelector(".task-lives-line-holder");

                heartHolder.style.opacity = "0";
                heartHolder.style.top = "-5px";

                if(livesLineHolder !== null) {
                    livesLineHolder.style.width = "0";
                    livesLineHolder.style.opacity = "0";
                }

                setTimeout(() => {
                    heartHolder.style.opacity = "";
                    heartHolder.style.top = "";

                    if(livesLineHolder !== null) {
                        livesLineHolder.style.width = `${50 * this.exercise.lives}px`;
                        livesLineHolder.style.opacity = "";
                    }
                }, 100);
            }
        }
        
        function setLives() {
            taskLives.innerHTML = "";
            const isInfinity = currentLives === "infinity";
            
            const heartHolder = createElement({
                tag: "div",
                attributes: { class: "heart-holder" },
                appendTo: taskLives
            });
            
            createElement({
                tag: "img",
                attributes: {
                    src: `./images/icons/${isInfinity ? "infinity" : "lives"}-icon.png`,
                    alt: isInfinity ? "INFINITY" : "LIVE",
                    class: isInfinity ? "task-lives-infinity" : ""
                },
                appendTo: heartHolder
            });
            
            if(!isInfinity) {
                taskLives.style.filter = "";
                
                const heartStrong = createElement({
                    tag: "strong",
                    innerText: currentLives,
                    style: start ? null : { opacity: "0", top: "40%" },
                    appendTo: heartHolder
                });

                setTimeout(() => {
                    if(!start) {
                        heartStrong.style.opacity = "";
                        heartStrong.style.top = "";
                    }
                }, 100);
                
                const livesLineHolder = createElement({
                    tag: "div",
                    attributes: { class: "task-lives-line-holder" },
                    style: { width: `${50 * exercise.lives}px` },
                    appendTo: taskLives
                });

                if(currentLives === 0) setTimeout(() => {
                    livesLineHolder.style.width = "0";

                    setTimeout(() => {
                        heartHolder.style.opacity = "0";
                        heartHolder.style.top = "5px";
                    }, 300);
                }, 100);
                
                for(let i = 0; i < currentLives; i++) createElement({
                    tag: "div",
                    attributes: { class: "task-lives-line" },
                    appendTo: livesLineHolder
                });
            }
        }
    }
    
    check(e, additionalPass = false) {
        const { currentTask, messageNumber } = this;
        
        const {
            taskButtonHolder, checkButton, taskInfo, taskInfoImg, taskInfoTextH4, taskInfoTextP,
            taskInfoButton
        } = this.elements;

        const [progressBar, progressBarP] = [...this.taskProgressBarHolder.children];
        const [progressBarLine] = [...progressBar.children];

        const blockedKeydownCheck = ["connect"];
        if(e.type === "keydown" && blockedKeydownCheck.indexOf(this.currentTask.type) > -1) return;

        const classPass = (checkButton !== null && !checkButton.classList.contains("disabled-wide-button")) || additionalPass;
        if(!classPass) return;

        const keyPass = additionalPass ? e.key === "Enter" || !isNaN(parseInt(e.key)) : e.key === "Enter";
        
        if(e.type === "keydown" && !keyPass) return;

        this.afterCheck();

        window.eventList.remove("taskCheckKeyDown");
        if(window.eventList.get("taskCompleteTextKeydown")) window.eventList.remove("taskCompleteTextKeydown");

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
        const [answers, random] = formatAnswer(this.currentTask.type, acceptableAnswers);

        const nonRandomAnswerTypes = ["connect", "completeText"];
        
        const text = {
            correct: "",
            incorrect: `Correct answer${answers.correct.isPlural ? "s" : ""}: "<span>${nonRandomAnswerTypes.indexOf(this.currentTask.type) > -1 ? answers.correct.content : random.correctAnswer}</span>"`
        };

        const validText = isCorrect ? text.correct : text.incorrect;
        taskInfoTextP.innerHTML = validText;

        const audio = new Audio(`./sfx/${isCorrect ? "correct" : "wrong"}.mp3`);
        audio.play();
        
        if(!isCorrect) {
            if(this.currentLives !== "infinity" || this.currentLives > 0) this.currentLives--;
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

        let messageId = null;

        if(currentTask.type === "conversation") {
            messageId = this.currentTask.messages[this.messageNumber].id;
            this.messageNumber = 0;
        }

        const taskResult = {
            id: currentTask.id,
            messageId,
            title: currentTask.title,
            type: currentTask.type,
            acceptableAnswers,
            userAnswer: this.answer,
            isCorrect,
            xp: currentTask.xp || this.exercise.defaultXP || this.defaultXP,
            startTime: this.score.taskTimes[this.taskNumber],
            endTime: this.taskNumber === this.tasks.length - 1 ? new Date().getTime() : null,
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
            switch(currentTask.type) {
                case "conversation": return currentTask.messages[messageNumber].acceptableAnswers;
                case "connect":
                    const firstSelectedButton = document.querySelector(".first-selected-button")?.innerText.split("\n")[0];
                    let correctTranslation = "";
                    
                    if(currentTask.options.hasOwnProperty(firstSelectedButton)) Object.keys(currentTask.options).forEach((key, index) => {
                        if(firstSelectedButton === key) correctTranslation = Object.values(currentTask.options)[index];
                    });

                    else Object.values(currentTask.options).forEach((value, index) => {
                        if(firstSelectedButton === value) correctTranslation = Object.keys(currentTask.options)[index];
                    });

                    return [firstSelectedButton, correctTranslation];
                case "completeText":
                    let completeTextAcceptableAnswers = [];

                    Object.values(currentTask.acceptableAnswers).forEach(value => {
                        if(value.length === 1) completeTextAcceptableAnswers.push(value[0]);
                        else completeTextAcceptableAnswers.push(value[Math.floor(Math.random() * value.length)]);
                    });

                    return completeTextAcceptableAnswers;
                case "listen":
                    if(currentTask.cantHear === undefined) return [currentTask.text];
                    else return currentTask.acceptableAnswers;
                default: return currentTask.acceptableAnswers;
            }
        }
    }

    isCorrect() {
        let result;
        
        switch(this.currentTask.type) {
            case "multipleChoice":
            case "multipleChoiceOfImage":
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
                
                const lastMessageAcceptableAnswers = this.currentTask.messages[this.messageNumber].acceptableAnswers;
                const lastUserAnswer = this.answer[this.answer.length - 1];
                
                lastMessageAcceptableAnswers.forEach(answer => {
                    if(breakText(lastUserAnswer, { join: true }) === breakText(answer, { join: true })) result = true;
                });

                break;
            case "connect":
                result = false;
                
                const answerKey = this.answer.answer[this.currentTask.options.hasOwnProperty(this.answer.answer[0]) ? 0 : 1];
                const answerValue = this.answer.answer[answerKey === this.answer.answer[0] ? 1 : 0];

                Object.keys(this.currentTask.options).forEach((key, index) => {
                    if(answerKey === key) {
                        const value = Object.values(this.currentTask.options)[index];
                        if(answerValue === value) result = true;
                    }
                });

                break;
            case "completeText":
                result = true;
                
                const allResults = [];
                
                Object.keys(this.answer).forEach((key, index) => {
                    const value = Object.values(this.answer)[index];
                    const acceptableValue = Object.values(this.currentTask.acceptableAnswers)[index];
                    
                    Object.keys(this.currentTask.acceptableAnswers).forEach(acceptableKey => {
                        if(key === acceptableKey) {
                            let currentResult = false;
                            
                            acceptableValue.forEach(acceptableAnswer => {
                                if(breakText(value, { join: true }) === breakText(acceptableAnswer, { join: true })) currentResult = true;
                            });

                            allResults.push(currentResult);
                        }
                    });
                });

                allResults.forEach(r => { if(!r) result = false });
                
                break;
            case "listen":
                result = false;
                
                if(this.currentTask.cantHear === undefined) {
                    if(breakText(this.currentTask.text, { join: true }) === breakText(this.answer, { join: true })) result = true;
                }

                else this.currentTask.acceptableAnswers.forEach(answer => {
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
            case "completeText":
                const wordMiniModals = document.querySelectorAll(".complete-text-word");
                
                wordMiniModals.forEach(wordMiniModal => {
                    const wordMiniModalTop = parseFloat(getComputedStyle(wordMiniModal).getPropertyValue("top"));

                    wordMiniModal.classList.remove("active-mini-modal");
                    wordMiniModal.style.top = `${wordMiniModalTop - 10}px`;
                    
                    setTimeout(() => wordMiniModal.remove(), 300);
                });

                break;
            case "listen":
                const listenHolderTextarea = document.querySelector(".listen-holder textarea");
                listenHolderTextarea.disabled = true;
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

        if(this.answer) checkButton.classList.remove("disabled-wide-button");
        else if(!checkButton.classList.contains("disabled-wide-button")) checkButton.classList.add("disabled-wide-button");
    }

    construct(changeMode = false) {
        const { currentTask, messageNumber } = this;
        
        const taskModes = this.getTaskModes();

        if(taskModes) {
            if(this.currentTask.mode === undefined) this.currentTask.mode = { type: "write", switch: false };
            if(this.currentTask.mode.type === undefined) this.currentTask.mode = {...this.currentTask.mode, type: "write"};
            if(this.currentTask.mode.switch === undefined) this.currentTask.mode = {...this.currentTask.mode, switch: false};
        }
        
        if(this.currentTask.mode?.type === "random") randomMode(taskModes);

        constructTask(this, changeMode);

        function randomMode(taskModes) {
            const randomModeType = taskModes[Math.floor(Math.random() * taskModes.length)];
            const optionsRequired = ["wordBank", "multipleChoice"];
    
            const optionsProp = currentTask.type === "conversation" ? currentTask.messages[messageNumber].options : currentTask.options;
                
            if(optionsRequired.indexOf(randomModeType) > -1 && optionsProp === undefined) currentTask.mode.type = "write";
            else currentTask.mode.type = randomModeType;
        }
    }

    switchModes() {
        const { currentTask } = this;
        const { switchModesButton } = this.elements;
        
        const icons = {
            write: { src: "./images/icons/write-icon.png", alt: "Write" },
            wordBank: { src: "./images/icons/word-bank-icon.png", alt: "Word Bank" },
            multipleChoice: { src: "./images/icons/multiple-choice-icon.png", alt: "Multiple Choice" }
        };
        
        const taskModes = this.getTaskModes();
        const invertedTaskMode = currentTask.mode.type === taskModes[0] ? taskModes[1] : taskModes[0];
        const invertedIcon = getInvertedIcon();
        
        if(currentTask.mode.switch) {
            if(currentTask.mode.type === "write" && (currentTask.type === "conversation" ? this.currentTask.messages[this.messageNumber].options : currentTask.options) === undefined) return;
            
            switchModesButton.classList.add("active-switch-modes-button");
            switchModesButton.onclick = () => changeMode(this);

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

        function getInvertedIcon() {
            let result;
            
            Object.keys(icons).forEach((key, index) => {
                if(invertedTaskMode === key) result = Object.values(icons)[index];
            });

            return result;
        }
    }

    getTaskModes() {
        const allModes = {
            translate: ["write", "wordBank"],
            conversation: ["write", "multipleChoice"],
            completeText: ["write", "wordBank"]
        };
        
        let result;

        Object.keys(allModes).forEach((key, index) => {
            if(this.currentTask.type === key) result = Object.values(allModes)[index];
        });

        return result;
    }

    loadVoices() {
        return new Promise(resolve => {
            const loading = Component.create("Loading", {
                tips: true,
                style: { backgroundImage: "none" },
                appendTo: this.exerciseModal
            });
            
            const speakTasks = [];

            this.tasks.forEach(task => {
                if(task.type === "listen" || task.speak) speakTasks.push(task);
            });

            if(speakTasks.length === 0) {
                loading.remove();
                resolve(true);
            }

            speakTasks.forEach((task, index) => {
                const lastTask = speakTasks.length - 1 === index;
                
                switch(task.type) {
                    case "multipleChoice":
                    case "multipleChoiceImages":
                        prerenderVoices(task.options, lastTask);
                        break;
                    case "translate":
                        if(!task.englishSerbian) prerenderVoices([task.text], lastTask);
                        else prerenderVoices(task?.options, lastTask);
                        break;
                    case "conversation":
                        prerenderVoices(task.messages, lastTask);
                        break;
                    case "connect":
                        prerenderVoices(Object.values(task.options), lastTask);
                        break;
                    case "completeText":
                        prerenderVoices(task.options, lastTask);
                        break;
                    case "listen":
                        prerenderVoices([task.text], lastTask);
                        break;
                    default: ;
                }
            });

            function prerenderVoices(voices, lastTask) {
                voices.forEach(voice => {
                    const validVoice = typeof voice === "object" ? voice.content : voice;
                    responsiveVoice.speak(validVoice, "Serbian Male", { volume: 0, onend: lastTask ? renderedVoices : null });
                });

                function renderedVoices() {
                    loading.remove();
                    resolve(true);
                }
            }
        });
    }
}