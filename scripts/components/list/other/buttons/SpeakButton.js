import createElement from "../../../../functions/element/createElement.js";

export default function SpeakButton(componentProps) {
    const { builtIn } = componentProps;
    const { speak, appendTo } = componentProps.params;
    
    const speakButtonElement = builtIn ? builtIn : createElement({
        tag: "button",
        attributes: { class: "speak-button" },
        events: [{ on: "click", call: speakFunction }],
        appendTo
    });

    createElement({
        tag: "img",
        attributes: { src: "./images/icons/speak-icon.svg", alt: "SPEAK" },
        appendTo: speakButtonElement
    });

    speakFunction();

    function speakFunction() {
        speakButtonElement.classList.add("active-speak-button");
        
        responsiveVoice.speak(
            speak,
            "Serbian Male",
            { onend: () => speakButtonElement.classList.remove("active-speak-button") }
        );
    }

    return speakButtonElement;
}