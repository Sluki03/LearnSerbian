import { Component } from "../../../../components/Component.js";
import createElement from "../../../../functions/createElement.js";
import setTranslatableWords from "../../setTranslatableWords.js";
import { Shorten } from "../../../../functions/Shorten.js";

export async function sendMessage(thisExercise, message, e) {
    const conversationMessages = document.querySelector(".conversation-messages");
    
    const conversationAnswer = document.querySelector(".conversation-answer");
    const conversationAnswerInput = conversationAnswer.children[1];
    
    const conversation = {
        pause: () => new Promise(resolve => {
            if(thisExercise.currentTask.mode.type === "write") {
                conversationAnswerInput.disabled = true;
                conversationAnswerInput.placeholder = `${thisExercise.currentTask.participant} is typing...`;
            }

            else if(conversationMessages.children.length === 1) buttonTyping(message.current);

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
                if(thisExercise.currentTask.mode.type === "write") {
                    const conversationAnswerInput = conversationAnswer.children[1];
                    
                    conversationAnswerInput.disabled = false;
                    conversationAnswerInput.placeholder = message.current.userContent;
                    conversationAnswerInput.maxLength = getInputMaxLength(message.current);
                    conversationAnswerInput.focus();

                    Shorten.placeholder(conversationAnswerInput);
                }

                else if(conversationMessages.children.length === 1) buttonTyping(message.current, false);

                resolve(messageIsCorrect ? message.current.content : randomWrongAnswer);
            }, typingDuration);
        }),

        end: () => {
            window.eventList.remove("taskOptionChooseKeydown", "taskCheckMessageKeyDown");

            const conversationAnswer = document.querySelector(".conversation-answer");
            const conversationAnswerInput = conversationAnswer.children[1];
    
            if(thisExercise.currentTask.mode.type === "write") {
                conversationAnswer.classList.remove("active-conversation-answer");
                conversationAnswer.classList.add("disabled-conversation-answer");
            
                conversationAnswerInput.disabled = true;
                conversationAnswerInput.placeholder = "Write a message...";
            }

            const activeMultipleChoiceButton = document.querySelector(".conversation-answer-button-holder .active-multiple-choice-button");
            const activeMultipleChoiceButtonContent = activeMultipleChoiceButton ? activeMultipleChoiceButton.innerText : getUserMessage();
            
            thisExercise.answerChanged(thisExercise.currentTask.mode.type === "write" ? getUserMessage() : activeMultipleChoiceButtonContent);
            thisExercise.check(e, true);

            function getUserMessage() {
                let lastUserMessageHolder;
                
                [...conversationMessages.children].forEach(child => {
                    if(!child.classList.contains("user-message-holder")) return;
                    lastUserMessageHolder = child;
                });

                const lastUserMessage = lastUserMessageHolder.children[0];
                return lastUserMessage.innerText;
            }
        }
    };
    
    const messageHolder = createElement({
        tag: "div",
        attributes: { class: `${message.role}-message-holder disabled-message-holder` },
        appendTo: conversationMessages
    });

    setTimeout(() => { messageHolder.classList.remove("disabled-message-holder") }, 100);
    
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

        if(thisExercise.currentTask.speak && !responsiveVoice.isPlaying()) {
            responsiveVoice.speak(participantAnswer);
            Component.create("SpeakButton", { speak: participantAnswer, appendTo: messageHolder });
        }
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

export function buttonTyping(currentMessage, status = true) {
    const conversationAnswerButtonHolder = document.querySelector(".conversation-answer-button-holder");
    
    if(status) {
        translationModal(currentMessage.userContent, "down");
        
        [...conversationAnswerButtonHolder.children].forEach(child => {
            child.disabled = true;
            
            child.classList.add("disabled-multiple-choice-button");
            child.style.height = "40px";
            
            child.prevInnerText = child.innerText;
            child.innerText = "";
            
            Component.create("Typing", { appendTo: child });
        });
    }

    else {
        translationModal(currentMessage.userContent);
        
        [...conversationAnswerButtonHolder.children].forEach(child => {
            child.disabled = false;
            
            child.classList.remove("disabled-multiple-choice-button");
            child.style.height = "";
            
            child.innerText = child.prevInnerText;
        });

        const buttonTypingComponents = document.querySelectorAll("button .typing");
        buttonTypingComponents.forEach(typingComponent => typingComponent.remove());
    }
}

let inProgress = false;

export function translationModal(content, direction = "up") {
    if(inProgress) return;
    inProgress = true;
    
    const conversationAnswerP = document.querySelector(".conversation-answer p");
    
    if(direction === "up") {
        conversationAnswerP.innerText = content;

        const conversationAnswePHeight = getComputedStyle(conversationAnswerP).getPropertyValue("height");
                
        conversationAnswerP.style.opacity = "1";
        conversationAnswerP.style.top = `-${conversationAnswePHeight}`;

        inProgress = false;
    }

    else {
        conversationAnswerP.style.opacity = "";
        conversationAnswerP.style.top = "";

        setTimeout(() => {
            conversationAnswerP.innerText = "";
            inProgress = false;
        }, 300);
    }
}