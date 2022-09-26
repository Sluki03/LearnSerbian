import { TaskFunctions } from "./TaskFunctions.js";
import { Component } from "../../components/Component.js";
import { Convert } from "../../functions/Convert.js";
import createElement from "../../functions/createElement.js";
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
        this.currentTask = this.tasks[this.taskNumber];
        this.prevModeValues = { textareaValue: "", options: { textHolder: [], wordBank: [] }  };

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
            if(this.currentTask.type !== "conversation") taskButtonHolder.classList.add("active-task-button-holder");
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
    
    check(e) {
        const { currentTask } = this;
        
        const {
            taskButtonHolder, checkButton, taskInfo, taskInfoImg, taskInfoTextH4, taskInfoTextP,
            taskInfoButton
        } = this.elements;

        const [progressBar, progressBarP] = [...this.taskProgressBarHolder.children];
        const [progressBarLine] = [...progressBar.children];
        
        if(checkButton.classList.contains("disabled-flag-button")) return;
        if(e.type === "keydown" && e.key !== "Enter") return;

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
                
                const lastMessageHolder = participantMessageHolders[participantMessageHolders.length - messageHolderIndex];
                const lastMessage = [...lastMessageHolder.children][0].innerText;

                let acceptableAnswers = [];

                currentTask.messages.forEach(message => {
                    if(lastMessage === message.text) acceptableAnswers = message.acceptableAnswers;
                });

                return acceptableAnswers;
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

    construct() {
        const { currentTask, prevModeValues, check, answerChanged, construct } = this;
        const { taskHolder, switchModesButton } = this.elements;
        
        const {
            setActiveButton, getButtonImage, setTranslatableWords,
            textareaValueChanged, moveOption, messageGenerator,
            sendMessage
        } = TaskFunctions;
        
        switch(this.currentTask.type) {
            case "multipleChoice":
            case "multipleChoiceImages":
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

                window.eventList.add({
                    id: "taskFunctionsSetActiveButton",
                    type: "keydown",
                    listener: setActiveButton,
                    params: { randomOptions, answerChanged }
                });
                
                break;
            case "translate":
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

                if(this.currentTask.mode === undefined) this.currentTask.mode = { type: "write", switch: false };
                if(this.currentTask.mode.type === undefined) this.currentLives.mode = {...this.currentTask.mode, type: "write"};
                if(this.currentTask.mode.switch === undefined) this.currentTask.mode = {...this.currentTask.mode, switch: false};
                
                const modeTypes = ["write", "wordBank"];

                if(this.currentTask.mode.type === "random") {
                    const randomModeType = modeTypes[Math.floor(Math.random() * modeTypes.length)];
                    
                    if(randomModeType === "wordBank" && this.currentTask.options === undefined) this.currentTask.mode.type = "write";
                    else this.currentTask.mode.type = randomModeType;
                }
                
                if(this.currentTask.mode.type === "write") {
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
                            { on: "input", call: () => {
                                answerChanged(translateHolderTextarea.value);
                                textareaValueChanged(translateHolderTextarea.value);
                            }},
    
                            { on: "keydown", call: e => { if(e.key === "Enter") e.preventDefault() } },
                            { on: "focus", call: () => translateHolderTextarea.classList.add("translate-holder-textarea-focused") },
                            
                            { on: "blur", call: e => {
                                if(e.relatedTarget && e.relatedTarget.nodeName.toLowerCase() === "button") translateHolderTextarea.focus();
                                else translateHolderTextarea.classList.remove("translate-holder-textarea-focused");
                            }}
                        ],
                        appendTo: translateHolder
                    });
    
                    if(this.prevModeValues.textareaValue) translateHolderTextarea.value = this.prevModeValues.textareaValue;
                    translateHolderTextarea.focus();
    
                    const buttonHolder = createElement({
                        tag: "div",
                        attributes: { class: "button-holder" },
                        appendTo: translateHolder
                    });
    
                    const holders = ["letters", "arrows"];
                    
                    const buttonOrder = {
                        letters: ["č", "ć", "đ", "š", "ž"],
                        arrows: ["🡡", "🡣"]
                    };
    
                    for(let i = 0; i < holders.length; i++) createElement({
                        tag: "div",
                        attributes: { class: `button-holder-${holders[i]}` },
                        appendTo: buttonHolder
                    });
    
                    const [buttonHolderLetters, buttonHolderArrows] = [...buttonHolder.children];
    
                    buttonOrder.letters.forEach(letter => {
                        const button = createElement({
                            tag: "button",
                            innerText: translateHolderTextarea.value ? letter : letter.toUpperCase(),
                            events: [{ on: "click", call: () => updateTextareaOnButtonClick(button) }],
                            appendTo: buttonHolderLetters
                        });
                    });
                    
                    const changeCaseButton = createElement({
                        tag: "button",
                        innerText: buttonOrder.arrows[translateHolderTextarea.value ? 0 : 1],
                        events: [{ on: "click", call: changeCaseStatus }],
                        appendTo: buttonHolderArrows
                    });
    
                    function updateTextareaOnButtonClick(button) {
                        translateHolderTextarea.value += button.innerText;
                        answerChanged(translateHolderTextarea.value);
                        textareaValueChanged(translateHolderTextarea.value);
                    }
    
                    function changeCaseStatus() {
                        const firstArrow = buttonHolderArrows.children[0];
                        if(!firstArrow.classList.contains("locked-arrow")) firstArrow.classList.add("locked-arrow");
                        
                        const firstButton = buttonHolderLetters.children[0].innerText;
                        const isUpperCase = firstButton === firstButton.toUpperCase();
    
                        changeCaseButton.innerText = buttonOrder.arrows[isUpperCase ? 0 : 1];
    
                        [...buttonHolderLetters.children].forEach(button => {
                            if(isUpperCase) button.innerText = button.innerText.toLowerCase();
                            else button.innerText = button.innerText.toUpperCase();
                        });
                    }
                }

                if(this.currentTask.mode.type === "wordBank") {
                    const textHolder = createElement({
                        tag: "div",
                        attributes: { class: "text-holder" },
                        appendTo: translateHolder
                    });
                    
                    const wordBankOptionsHolder = createElement({
                        tag: "div",
                        attributes: { class: "word-bank-options-holder" },
                        appendTo: translateHolder
                    });
                    
                    if(prevModeValues.options.textHolder.length > 0) {        
                        prevModeValues.options.textHolder.forEach(option => createElement(getWordBankOption(option, true)));
                        prevModeValues.options.wordBank.forEach(option => createElement(getWordBankOption(option, true)));
                    }
                    
                    else {
                        const randomOptions = randomArray(this.currentTask.options);
                        randomOptions.forEach(option => createElement(getWordBankOption(option)));
                    }

                    function getWordBankOption(option, isDynamic) {
                        const optionSelectiveTypeClass = isDynamic ? `word-bank-option-${isSelective(option)}` : "word-bank-option-selective";
                        const moveOptionType = isDynamic ? isSelective(option).substring(-2) : "select";
                        const selectiveTypeAppendTo = isDynamic ? isSelective(option) === "selective" ? wordBankOptionsHolder : textHolder : wordBankOptionsHolder;
                        
                        return {
                            tag: "button",
                            attributes: { class: `word-bank-option word-bank-option-${option} ${optionSelectiveTypeClass}` },
                            innerText: option,
                            events: [{ on: "click", call: () => moveOption(option, moveOptionType, answerChanged) }],
                            appendTo: selectiveTypeAppendTo
                        };
                    }
                }

                const icons = {
                    write: { src: "../../../images/icons/write-icon.svg", alt: "Write" },
                    wordBank: { src: "../../../images/icons/word-bank-icon.svg", alt: "Word Bank" }
                };
                
                const invertedModeIcon = this.currentTask.mode.type === "write" ? icons.wordBank : icons.write;

                if(currentTask.mode.switch) {
                    if(currentTask.mode.type === "write" && currentTask.options === undefined) return;
                    
                    switchModesButton.classList.add("active-switch-modes-button");
                    switchModesButton.onclick = swithModes;

                    const switchModesImg = document.querySelector(".active-switch-modes-button img");

                    if(switchModesImg === null) createElement({
                        tag: "img",
                        attributes: { src: invertedModeIcon.src, alt: invertedModeIcon.alt },
                        appendTo: switchModesButton
                    });

                    else {
                        switchModesImg.src = invertedModeIcon.src;
                        switchModesImg.alt = invertedModeIcon.alt;
                    }
                }

                function swithModes() {
                    if(currentTask.mode.type === "write") {
                        currentTask.mode.type = "wordBank";

                        const translateHolderTextarea = document.querySelector(".translate-holder textarea");
                        prevModeValues.textareaValue = translateHolderTextarea.value;
                    }
                    
                    else {
                        currentTask.mode.type = "write";

                        let words = {
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

                       prevModeValues.options = words;
                    }

                    taskHolder.innerHTML = "";
                    construct();
                }

                function isSelective(option) {
                    let result;

                    if(prevModeValues.options.textHolder.indexOf(option) > -1) result = false;
                    if(prevModeValues.options.wordBank.indexOf(option) > -1) result = true;

                    return result ? "selective" : "deselective";
                }

                break;
            case "conversation":
                taskHolder.style.height = "70%";
            
                const conversationHolder = document.querySelector("[data-template='exercise-modal-task-conversation']").content.firstElementChild.cloneNode(true);
                taskHolder.appendChild(conversationHolder);
                Component.render(conversationHolder);

                const [conversationParticipant, conversationMessages, conversationAnswer] = [...conversationHolder.children];
                
                const participantName = conversationParticipant.children[1];
                participantName.innerText = this.currentTask.participant;

                const participantTyping = conversationParticipant.children[2];

                const messages = messageGenerator(this.currentTask.messages, conversationMessages);
                let message = messages.next().value;

                const [conversationAnswerP, conversationAnswerCheckButton] = [...conversationAnswer.children];
                
                const conversationAnswerInput = createElement({
                    tag: "input",
                    attributes: { type: "text", placeholder: message.userText },
                    events: [{ on: "input", call: changeConversationAnswerStatus }],
                    appendTo: conversationAnswer,
                    before: conversationAnswerCheckButton
                });

                conversationAnswerInput.focus();

                conversationAnswerCheckButton.onclick = checkMessage;
                window.eventList.add({ id: "taskCheckMessageKeyDown", type: "keydown", listener: checkMessage });

                function changeConversationAnswerStatus() {
                    if(conversationAnswerInput.value) conversationAnswer.classList.add("active-conversation-answer");
                    else if(conversationAnswer.classList.contains("active-conversation-answer")) conversationAnswer.classList.remove("active-conversation-answer");
                }
                
                function checkMessage(e) {
                    if(e.type === "keydown" && e.key !== "Enter") return;
                    
                    let isCorrect = false;
                    const userMessage = conversationAnswerInput.value;

                    if(!userMessage) return;
                    
                    message.acceptableAnswers.forEach(acceptableAnswer => {
                        if(breakText(userMessage, { join: true }) === breakText(acceptableAnswer, { join: true })) isCorrect = true;
                    });

                    sendMessage("user", userMessage, conversationMessages);
                    
                    conversationAnswerInput.value = "";
                    if(conversationAnswer.classList.contains("active-conversation-answer")) conversationAnswer.classList.remove("active-conversation-answer");

                    if(isCorrect) {
                        message = messages.next().value;
                        
                        if(message === undefined) conversationEnd();
                        else conversationAnswerInput.placeholder = message.userText;
                    }

                    else {
                        const wrongAnswers = [
                            "Šta?",
                            "O čemu ti?",
                            "O čemu ti pričaš?",
                            "Ne razumem...",
                            "Ne razumem šta si hteo da kažeš.",
                            "Pričaj srpski.",
                            "Molim?"
                        ];

                        const randomWrongAnswer = wrongAnswers[Math.floor(Math.random() * wrongAnswers.length)];
                        const typingDuration = randomWrongAnswer.length * 100;
                        
                        conversationAnswerInput.disabled = true;
                        participantTyping.classList.add("active-conversation-participant-typing");
                        
                        setTimeout(() => {
                            conversationAnswerInput.disabled = true;
                            conversationAnswerInput.focus();

                            participantTyping.classList.remove("active-conversation-participant-typing");
                            
                            sendMessage("participant", randomWrongAnswer, conversationMessages);
                            conversationEnd();
                        }, typingDuration);
                    }

                    function conversationEnd() {
                        window.eventList.remove("taskCheckMessageKeyDown");
                        
                        if(conversationAnswer.classList.contains("active-conversation-answer")) conversationAnswer.classList.remove("active-conversation-answer");
                        conversationAnswer.classList.add("disabled-conversation-answer");
                        
                        conversationAnswerInput.placeholder = "Write a message...";
                        conversationAnswerInput.disabled = true;
                            
                        answerChanged(userMessage);
                        check(e);
                    }
                }

                break;
            default: return;
        }
    }
}