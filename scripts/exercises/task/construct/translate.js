import createElement from "../../../functions/createElement.js";
import randomArray from "../../../functions/randomArray.js";
import setTranslatableWords from "../setTranslatableWords.js";

export default function translate(thisTask) {
    const { taskHolder } = thisTask.elements;
    
    const translateHolder = createElement({
        tag: "div",
        attributes: { class: "translate-holder" },
        appendTo: taskHolder
    });
    
    const translateHolderP = createElement({
        tag: "p",
        appendTo: translateHolder
    });

    setTranslatableWords(translateHolderP, thisTask.currentTask.text, thisTask.currentTask.translation);

    if(thisTask.currentTask.mode === undefined) thisTask.currentTask.mode = { type: "write", switch: false };
    if(thisTask.currentTask.mode.type === undefined) thisTask.currentLives.mode = {...thisTask.currentTask.mode, type: "write"};
    if(thisTask.currentTask.mode.switch === undefined) thisTask.currentTask.mode = {...thisTask.currentTask.mode, switch: false};
    
    const modeTypes = ["write", "wordBank"];

    if(thisTask.currentTask.mode.type === "random") {
        const randomModeType = modeTypes[Math.floor(Math.random() * modeTypes.length)];
        
        if(randomModeType === "wordBank" && thisTask.currentTask.options === undefined) thisTask.currentTask.mode.type = "write";
        else thisTask.currentTask.mode.type = randomModeType;
    }
    
    if(thisTask.currentTask.mode.type === "write") {
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
                    thisTask.answerChanged(translateHolderTextarea.value);
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

        if(thisTask.prevModeValues.write.translate.textareaValue) translateHolderTextarea.value = thisTask.prevModeValues.write.translate.textareaValue;
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
            thisTask.answerChanged(translateHolderTextarea.value);
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

    if(thisTask.currentTask.mode.type === "wordBank") {
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
        
        if(thisTask.prevModeValues.wordBank.translate.textHolder.length > 0) {        
            thisTask.prevModeValues.wordBank.translate.textHolder.forEach(option => createElement(getWordBankOption(option, true)));
            thisTask.prevModeValues.wordBank.translate.wordBank.forEach(option => createElement(getWordBankOption(option, true)));
        }
        
        else {
            const randomOptions = randomArray(thisTask.currentTask.options);
            randomOptions.forEach(option => createElement(getWordBankOption(option)));
        }

        function getWordBankOption(option, isDynamic) {
            const optionSelectiveTypeClass = isDynamic ? `word-bank-option-${isSelective(option)}` : "word-bank-option-selective";
            
            const selectiveType = isSelective(option);
            const moveOptionType = isDynamic ? selectiveType.substring(0, selectiveType.length - 3) : "select";
            
            const selectiveTypeAppendTo = isDynamic ? selectiveType === "selective" ? wordBankOptionsHolder : textHolder : wordBankOptionsHolder;
            
            return {
                tag: "button",
                attributes: { class: `word-bank-option word-bank-option-${option} ${optionSelectiveTypeClass}` },
                innerText: option,
                events: [{ on: "click", call: () => moveOption(option, moveOptionType) }],
                appendTo: selectiveTypeAppendTo
            };
        }
    }

    thisTask.switchModes();

    function isSelective(option) {
        let result;

        if(thisTask.prevModeValues.wordBank.translate.textHolder.indexOf(option) > -1) result = false;
        if(thisTask.prevModeValues.wordBank.translate.wordBank.indexOf(option) > -1) result = true;

        return result ? "selective" : "deselective";
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

    function moveOption(option, type) {
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
            
            selectedOptionClone.onclick = () => moveOption(option, invertedType);

            let textArray = [];
            
            [...textHolder.children].forEach(child => {
                textArray.push(child.innerText);
            });

            thisTask.answerChanged(textArray.join(" "));
            inProgress = false;
        }, 300);
    }
}