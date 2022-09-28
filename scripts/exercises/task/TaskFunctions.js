import createElement from "../../functions/createElement.js";
import breakText from "../../functions/breakText.js";

export const TaskFunctions = {
    setActiveButton, getButtonImage, setTranslatableWords,
    textareaValueChanged, moveOption, messageGenerator,
    newMessage, sendMessage, conversationEnd
};

function setActiveButton(e) {
    e.preventDefault();
    
    const taskInfo = document.querySelector(".task-info");
    const taskInfoBottom = parseInt(getComputedStyle(taskInfo).getPropertyValue("bottom"));

    if(taskInfoBottom === 0) return;
    
    const setActiveButtonParams = window.eventList.getParams("taskFunctionsSetActiveButton");
    const { randomOptions, answerChanged } = setActiveButtonParams;

    const id = e.type === "keydown" ? parseInt(e.key) : e.target.id.split("-")[3];
    
    if(isNaN(id) || id > randomOptions.length) return;
    
    const allButtons = document.querySelectorAll(".multiple-choice-button");
    const buttonId = `multiple-choice-button-${id}`;

    allButtons.forEach(button => {
        if(button.classList.contains("active-multiple-choice-button") && button.id !== buttonId) button.classList.remove("active-multiple-choice-button");
        
        if(button.id === buttonId) {
            button.classList.add("active-multiple-choice-button");
            answerChanged(randomOptions[id - 1]);
        }
    });
}

function getButtonImage(images, option) {
    let result;

    Object.keys(images).forEach((image, index) => {
        if(image === option) result = Object.values(images)[index];
    });

    return result;
}

function setTranslatableWords(parent, text, translation) {
    const brokenText = breakText(text, { lowerCase: false });
    let updatedText = text;

    const allTranslations = Object.keys(translation);

    brokenText.forEach(word => {
        const translationId = allTranslations.indexOf(word.toLowerCase());
        if(translationId > -1) updatedText = updatedText.replace(word, `<span class="word word-${word.toLowerCase()}">${word}</span>`);
    });

    parent.innerHTML = updatedText;

    let previousWord = "";

    parent.onclick = e => {
        if(!e.target.classList.contains("word")) return;
        
        const wordElement = e.target;
        const word = wordElement.classList[1].split("-")[1];

        const translatedWord = translate(word);

        if(previousWord === translatedWord) return;
        previousWord = translatedWord;

        const translateHolderSpan = document.querySelector(`.translate-holder p .word-${word}`);
        translateHolderSpan.style.borderBottom = "3px solid #5e5c5c";

        const wordTranslation = createElement({
            tag: "p",
            attributes: { class: "word-translation" },
            innerText: translatedWord,
            appendTo: translateHolderSpan
        });

        setTimeout(() => { wordTranslation.classList.add("active-word-translation") }, 100);

        if(window.eventList.get("taskFunctionsClick")) window.eventList.remove("taskFunctionsClick");
        window.eventList.add({ id: "taskFunctionsClick", type: "click", listener: closeWordTranslation });

        function closeWordTranslation(e) {
            e.stopPropagation();

            const existingWordTranslation = document.querySelector(".active-word-translation");
            if(existingWordTranslation === null || e.target.classList.contains("word-translation")) return;

            const existingTranslateHolderSpan = existingWordTranslation.parentNode;
            existingTranslateHolderSpan.style.borderBottom = "";
            
            existingWordTranslation.classList.remove("active-word-translation");
            setTimeout(() => { existingWordTranslation.remove() }, 300);

            if(!e.target.classList.contains("word") || existingWordTranslation.innerText === translatedWord) {
                window.eventList.remove("taskFunctionsClick");
                previousWord = "";
            }
        }
    }

    function translate(word) {
        let result = "";

        Object.keys(translation).forEach((key, index) => {
            if(key === word) result = Object.values(translation)[index]; 
        });

        return result;
    }
}

function textareaValueChanged(newValue) {
    const buttonHolder = document.querySelector(".translate-holder .button-holder");
    const [buttonHolderLetters, buttonHolderArrows] = [...buttonHolder.children];

    const firstArrow = buttonHolderArrows.children[0];
    if(firstArrow.classList.contains("locked-arrow"))  return;

    [...buttonHolderLetters.children].forEach(button => {
        if(newValue) button.innerText = button.innerText.toLowerCase();
        else button.innerText = button.innerText.toUpperCase();
    });

    const arrowSymbols = ["🡡", "🡣"];
    firstArrow.innerText = arrowSymbols[newValue ? 0 : 1];
}

let inProgress = false;

function moveOption(option, type, answerChanged) {
    if(inProgress) return;
    inProgress = true;
    
    const textHolder = document.querySelector(".text-holder");
    const wordBankOptionsHolder = document.querySelector(".word-bank-options-holder");

    const selectedOption = document.querySelector(`.word-bank-option-${option}`);

    const removeableClasses = ["word-bank-option-selective", "word-bank-option-deselective"];
    
    removeableClasses.forEach(removeableClass => {
        if(selectedOption.classList.contains(removeableClass)) selectedOption.classList.remove(removeableClass);
    });
    
    const selectedOptionClone = selectedOption.cloneNode(true);
    
    selectedOption.classList.add(type === "select" ? "word-bank-option-selective" : "word-bank-option-deselective");
    selectedOptionClone.classList.add(type !== "select" ? "word-bank-option-selective" : "word-bank-option-deselective");

    selectedOption.style.opacity = "0";
    selectedOption.style.top = type === "select" ? "-10px" : "10px";

    selectedOptionClone.style.opacity = "0";
    selectedOptionClone.style.top = type === "select" ? "10px" : "-10px";

    setTimeout(() => {
        selectedOption.remove();

        const appendElement = type === "select" ? textHolder : wordBankOptionsHolder;
        const invertedType = type === "select" ? "deselect" : "select";

        appendElement.appendChild(selectedOptionClone);
        
        setTimeout(() => {
            selectedOptionClone.style.opacity = "";
            selectedOptionClone.style.top = "";
        }, 100);
        
        selectedOptionClone.onclick = () => moveOption(option, invertedType, answerChanged);

        let textArray = [];
        
        [...textHolder.children].forEach(child => {
            textArray.push(child.innerText);
        });

        answerChanged(textArray.join(" "));
        inProgress = false;
    }, 300);
}

function* messageGenerator(currentTask) {
    for(const message of currentTask.messages) {
        newMessage(currentTask, message, true);
        yield message;
    }
}

function newMessage(currentTask, message, isCorrect, conversationEndParams) {
    const participantTyping = document.querySelector(".conversation-participant span");
    const conversationAnswerInput = document.querySelector(".conversation-answer input");

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

    const typingDuration = (isCorrect ? message.text.length : randomWrongAnswer.length) * 100;
        
    if(conversationAnswerInput !== null) {
        conversationAnswerInput.disabled = true;
        conversationAnswerInput.placeholder = `${currentTask.participant} is typing...`;
    }

    participantTyping.classList.add("active-conversation-participant-typing");

    setTimeout(() => {
        if(conversationAnswerInput !== null) {
            conversationAnswerInput.disabled = false;
            conversationAnswerInput.focus();
        }
            
        participantTyping.classList.remove("active-conversation-participant-typing");

        sendMessage("participant", isCorrect ? message.text : randomWrongAnswer);
        if(!isCorrect) conversationEnd(...conversationEndParams);
    }, typingDuration);
}

function sendMessage(role, text) {
    const conversationMessages = document.querySelector(".conversation-messages");
    
    const messageHolder = createElement({
        tag: "div",
        attributes: { class: `${role}-message-holder` },
        appendTo: conversationMessages
    });
    
    createElement({
        tag: "p",
        attributes: { class: `${role}-message` },
        innerText: text,
        appendTo: messageHolder
    });
}

function conversationEnd(check, answerChanged) {
    window.eventList.remove("taskCheckMessageKeyDown");

    const conversationAnswer = document.querySelector(".conversation-answer");
    const conversationAnswerInput = conversationAnswer.children[1];

    const userMessage = conversationAnswerInput.value;
    
    if(conversationAnswer.classList.contains("active-conversation-answer")) conversationAnswer.classList.remove("active-conversation-answer");
    conversationAnswer.classList.add("disabled-conversation-answer");
    
    conversationAnswerInput.placeholder = "Write a message...";
    conversationAnswerInput.disabled = true;
        
    answerChanged(userMessage);
    check(e);
}