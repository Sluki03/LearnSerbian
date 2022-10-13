import createElement from "../../../functions/createElement.js";

export default function DiacriticKeyboard(componentProps) {
    const { builtIn } = componentProps;
    const { input, answerChanged, appendTo } = componentProps.params;
    
    const diacriticKeyboard = builtIn ? builtIn : createElement({
        tag: "div",
        attributes: { class: "diacritic-keyboard" },
        appendTo
    });

    const holders = ["letters", "arrows"];
    
    const buttonOrder = {
        letters: ["č", "ć", "đ", "š", "ž"],
        arrows: ["🡡", "🡣"]
    };

    for(let i = 0; i < holders.length; i++) createElement({
        tag: "div",
        attributes: { class: `diacritic-keyboard-${holders[i]}` },
        appendTo: diacriticKeyboard
    });

    const [diacriticKeyboardLetters, diacriticKeyboardArrows] = [...diacriticKeyboard.children];

    buttonOrder.letters.forEach(letter => {
        const button = createElement({
            tag: "button",
            innerText: input.value ? letter : letter.toUpperCase(),
            events: [{ on: "click", call: () => updateInputOnButtonClick(button) }],
            appendTo: diacriticKeyboardLetters
        });
    });
    
    const changeCaseButton = createElement({
        tag: "button",
        innerText: buttonOrder.arrows[input.value ? 0 : 1],
        events: [{ on: "click", call: changeCaseStatus }],
        appendTo: diacriticKeyboardArrows
    });

    if(input.eventList.get("diacriticKeyboard") !== null) input.eventList.remove("diacriticKeyboard");
    input.eventList.add({ id: "diacriticKeyboard", type: "input", listener: inputValueChanged });

    return diacriticKeyboard;

    function updateInputOnButtonClick(button) {
        input.value += button.innerText;
        answerChanged(input.value);
        inputValueChanged(input.value);
    }

    function changeCaseStatus() {
        const firstArrow = diacriticKeyboardArrows.children[0];
        if(!firstArrow.classList.contains("locked-arrow")) firstArrow.classList.add("locked-arrow");
        
        const firstButton = diacriticKeyboardLetters.children[0].innerText;
        const isUpperCase = firstButton === firstButton.toUpperCase();

        changeCaseButton.innerText = buttonOrder.arrows[isUpperCase ? 0 : 1];

        [...diacriticKeyboardLetters.children].forEach(button => {
            if(isUpperCase) button.innerText = button.innerText.toLowerCase();
            else button.innerText = button.innerText.toUpperCase();
        });
    }

    function inputValueChanged() {
        const firstArrow = diacriticKeyboardArrows.children[0];
        if(firstArrow.classList.contains("locked-arrow")) return;
    
        [...diacriticKeyboardLetters.children].forEach(button => {
            if(input.value) button.innerText = button.innerText.toLowerCase();
            else button.innerText = button.innerText.toUpperCase();
        });
    
        const arrowSymbols = ["🡡", "🡣"];
        firstArrow.innerText = arrowSymbols[input.value ? 0 : 1];
    }
}