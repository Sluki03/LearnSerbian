import createElement from "../../../functions/createElement.js";

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

    function speakFunction() {
        if(responsiveVoice.isPlaying()) return;
        responsiveVoice.speak(speak);
    }

    return speakButtonElement;
}