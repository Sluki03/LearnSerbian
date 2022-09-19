import createElement from "../../functions/createElement.js";
import breakText from "../../functions/breakText.js";

export const TaskFunctions = { setActiveButton, getButtonImage, setTranslatableWords, textareaValueChanged };

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

            if(!e.target.classList.contains("word") || previousWord === translatedWord) window.eventList.remove("taskFunctionsClick");
            previousWord = "";
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