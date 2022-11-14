import { Component } from "../../components/Component.js";
import breakText from "../../functions/breakText.js";

export default function setTranslatableWords(parent, text, translation, englishSerbian = false) {
    const brokenText = breakText(text, { lowerCase: false });
    let updatedText = text;

    const allTranslations = Object.keys(translation || {});

    brokenText.forEach(word => {
        const translationId = allTranslations.indexOf(word.toLowerCase()) === -1 ? allTranslations.indexOf(word) : allTranslations.indexOf(word.toLowerCase());
        const lowerCaseStatus = allTranslations.indexOf(word.toLowerCase()) > -1;
        
        if(translationId > -1) updatedText = updatedText.replace(word, `<span class="word word-${lowerCaseStatus ? word.toLowerCase() : word}">${word}</span>`);
    });

    parent.innerHTML = updatedText;

    parent.onclick = e => {
        if(!e.target.classList.contains("word")) return;
        
        const wordElement = e.target;
        const word = wordElement.classList[1].split("-")[1];
        const translatedWord = translate(word);

        wordElement.style.borderBottom = "3px solid #5e5c5c";

        const miniModal = document.querySelector(".mini-modal");
        if(miniModal && miniModal.id === `mini-modal-word-${word}`) return;
        
        setTimeout(() => {
            Component.create("MiniModal", {
                target: e.target,
                id: `word-${word}`,
                content: translatedWord
            });

            if(!responsiveVoice.isPlaying()) responsiveVoice.speak(englishSerbian ? translatedWord : word);
        }, miniModal ? 300 : 0);
    }

    function translate(word) {
        let result = "";

        Object.keys(translation).forEach((key, index) => {
            if(key === word) result = Object.values(translation)[index]; 
        });

        return result;
    }
}