import { Component } from "../../../../components/Component.js";
import createElement from "../../../../functions/createElement.js";
import setTranslatableWords from "../../setTranslatableWords.js";
import getVisiblePlaceholder from "../../../../functions/getVisiblePlaceholder.js";

export async function sendMessage(thisTask, message, e) {
    const conversationAnswer = document.querySelector(".conversation-answer");
    const conversationAnswerInput = conversationAnswer.children[1];
    
    const conversation = {
        pause: () => new Promise(resolve => {
            if(thisTask.currentTask.mode.type === "write") {
                conversationAnswerInput.disabled = true;
                conversationAnswerInput.placeholder = `${thisTask.currentTask.participant} is typing...`;
            }

            const audio = new Audio("./sfx/typing.mp3");
            audio.play();
        
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

            const messageIsCorrect = message.isCorrect === undefined ? true : message.isCorrect;
            const typingDuration = participantBehavior(messageIsCorrect ? message.current.content : randomWrongAnswer, "typing");

            setTimeout(() => {
                if(thisTask.currentTask.mode.type === "write") {
                    conversationAnswerInput.disabled = false;
                    conversationAnswerInput.placeholder = message.current.userContent;
                    conversationAnswerInput.maxLength = getInputMaxLength(message.current);
                    conversationAnswerInput.focus();

                    getVisiblePlaceholder(conversationAnswerInput);
                }

                resolve(messageIsCorrect ? message.current.content : randomWrongAnswer);
            }, typingDuration);
        }),

        end: () => {
            window.eventList.remove("taskCheckMessageKeyDown");
    
            if(thisTask.currentTask.mode.type === "write") {
                const conversationAnswer = document.querySelector(".conversation-answer");
                const conversationAnswerInput = conversationAnswer.children[1];
            
                if(conversationAnswer.classList.contains("active-conversation-answer")) conversationAnswer.classList.remove("active-conversation-answer");
                conversationAnswer.classList.add("disabled-conversation-answer");
            
                conversationAnswerInput.disabled = true;
                conversationAnswerInput.placeholder = "Write a message...";
            }

            const activeMultipleChoiceButton = document.querySelector(".conversation-answer-button-holder .active-multiple-choice-button");

            thisTask.answerChanged(thisTask.currentTask.mode.type === "write" ? conversationAnswerInput.value : activeMultipleChoiceButton.innerText);
            thisTask.check(e, true);
        }
    };
    
    const conversationMessages = document.querySelector(".conversation-messages");
    
    const messageHolder = createElement({
        tag: "div",
        attributes: { class: `${message.role}-message-holder` },
        appendTo: conversationMessages
    });
    
    const messageContent = createElement({
        tag: "p",
        attributes: { class: `${message.role}-message` },
        innerText: message.role === "user" ? message.content : "",
        appendTo: messageHolder
    });

    if(message.role === "participant") {
        messageContent.style.height = "40px";
        messageContent.style.alignItems = "center";
        
        Component.create("Typing", { appendTo: messageContent });
    }

    if(message.role === "participant") {
        let participantAnswer = "";
        participantAnswer = await conversation.pause();
        
        messageContent.innerHTML = "";

        messageContent.style.height = "";
        messageContent.style.alignItems = "";

        setTranslatableWords(messageContent, participantAnswer, message.current.translation);
    }

    const audio = new Audio(`./sfx/${message.role === "user" ? "sent" : "received"}.mp3`);
    audio.play();

    if(e === undefined) return;
    if(message.role === "participant" && !message.isCorrect) conversation.end();
}

export function participantBehavior(message, action) {
    const simulate = {
        reading: randomTime(50, 25),
        typing: randomTime(150, 50),
        thinking: randomTime(1000, 500)
    };
    
    switch(action) {
        case "readingThinking":
            const messageReading = message.length === 0 ? 0 : message.length * simulate.reading;
            return messageReading + simulate.thinking;
        case "typing":
            const messageTyping = message.length * simulate.typing;
            return messageTyping;
        default: ;
    }

    function randomTime(max, min = 0) {
        return Math.floor(Math.random() * (max - min) + min);
    }
}

export function getInputMaxLength(message) {
    let longestAcceptableAnswer = "";

    message.acceptableAnswers.forEach(answer => {
        if(longestAcceptableAnswer.length < answer.length) longestAcceptableAnswer = answer;
    });

    return longestAcceptableAnswer.length;
}