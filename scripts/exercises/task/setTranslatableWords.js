import createElement from "../../functions/createElement.js";
import breakText from "../../functions/breakText.js";

export default function setTranslatableWords(parent, text, translation) {
    const body = document.querySelector("body");

    const brokenText = breakText(text, { lowerCase: false });
    let updatedText = text;

    const allTranslations = Object.keys(translation || {});

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

        wordElement.style.borderBottom = "3px solid #5e5c5c";

        const wordTranslation = createElement({
            tag: "p",
            attributes: { class: `word-translation word-translation-${word}` },
            innerText: translatedWord,
            appendTo: body
        });

        const wordElementRect = wordElement.getBoundingClientRect();
        const wordTranslationRect = wordTranslation.getBoundingClientRect();

        const globalPositions = { top: parseInt(wordElementRect.y), left: parseInt(wordElementRect.x) };

        const positions = {
            wordElement: {
                height: parseInt(wordElementRect.height),
                width: parseInt(wordElementRect.width)
            },

            wordTranslation: {
                height: parseInt(wordTranslationRect.height),
                width: parseInt(wordTranslationRect.width)
            }
        };

        const wordTranslationPositions = {
            top: globalPositions.top - positions.wordTranslation.height,
            left: (globalPositions.left + positions.wordElement.width / 2) - positions.wordTranslation.width / 2
        };
        
        wordTranslation.style.top = `${wordTranslationPositions.top - 10}px`;
        wordTranslation.style.left = `${wordTranslationPositions.left}px`;

        setTimeout(() => {
            wordTranslation.classList.add("active-word-translation");
            wordTranslation.style.top = `${wordTranslationPositions.top}px`;
        }, 100);

        if(window.eventList.get("taskFunctionsClick")) window.eventList.remove("taskFunctionsClick");
        window.eventList.add({ id: "taskFunctionsClick", type: "click", listener: closeWordTranslation });

        function closeWordTranslation(e) {
            e.stopPropagation();
            
            const existingWordTranslation = document.querySelector(".active-word-translation");
            if(existingWordTranslation === null || e.target.classList.contains("word-translation")) return;

            const existingWordTranslationWord = [...existingWordTranslation.classList][1].split("-")[2];
            
            const activeWordElement = document.querySelector(`.word-${existingWordTranslationWord}`);
            if(activeWordElement !== null) activeWordElement.style.borderBottom = "";
            
            existingWordTranslation.classList.remove("active-word-translation");
            wordTranslation.style.top = `${wordTranslationPositions.top - 10}px`;

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