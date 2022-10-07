import { Component } from "../../../../components/Component.js";
import { sendMessage, participantBehavior, getInputMaxLength } from "./functions.js";
import createElement from "../../../../functions/createElement.js";
import breakText from "../../../../functions/breakText.js";

let messageNumber = 0;

export default function interace(thisTask, changeMode) {
    let currentMessage = thisTask.currentTask.messages[messageNumber];
    thisTask.switchModes(currentMessage);
    
    const conversationAnswer = document.querySelector(".conversation-answer");
    const conversationAnswerP = createElement({ tag: "p", appendTo: conversationAnswer });
    
    if(thisTask.currentTask.mode.type === "write") {
        const conversationAnswerInput = createElement({
            tag: "input",
            attributes: { type: "text" },
            appendTo: conversationAnswer
        });
        
        if(changeMode) resetInput();

        const conversationAnswerCheckButton = Component.create("ArrowButton", { appendTo: conversationAnswer });
                
        conversationAnswerInput.maxLength = getInputMaxLength(currentMessage);
        conversationAnswerInput.oninput = changeConversationAnswerStatus;

        conversationAnswerCheckButton.onclick = e => checkMessage(e);
        
        if(window.eventList.get("taskCheckMessageKeyDown") !== null) window.eventList.remove("taskCheckMessageKeyDown");
        window.eventList.add({ id: "taskCheckMessageKeyDown", type: "keydown", listener: checkMessage });

        changeConversationAnswerStatus();

        function changeConversationAnswerStatus() {
            if(conversationAnswerInput.value) {
                conversationAnswer.classList.add("active-conversation-answer");
    
                conversationAnswerP.innerText = currentMessage.userContent;
    
                const conversationAnswePHeight = getComputedStyle(conversationAnswerP).getPropertyValue("height");
                            
                conversationAnswerP.style.opacity = "1";
                conversationAnswerP.style.top = `-${conversationAnswePHeight}`;
            }
                        
            else if(conversationAnswer.classList.contains("active-conversation-answer")) {
                conversationAnswer.classList.remove("active-conversation-answer");
    
                conversationAnswerP.style.opacity = "";
                conversationAnswerP.style.top = "";
    
                setTimeout(() => { conversationAnswerP.innerText = "" }, 300);
            }
        }

        function resetInput() {
            conversationAnswerInput.value = thisTask.prevModeValues.write.conversation.value;
            
            const conversationMessages = document.querySelector(".conversation-messages");
            const lastMessageHolder = conversationMessages.children[conversationMessages.children.length - 1];
            const lastMessage = lastMessageHolder.children[0];

            const messageRole = lastMessage.classList[0].split("-")[0];

            if(messageNumber > thisTask.currentTask.messages.length - 1) return;

            conversationAnswerInput.disabled = true;
            conversationAnswerInput.placeholder = getPlaceholder();

            function getPlaceholder() {
                let placeholder = "";
                const typing = document.querySelector(".typing");
                
                if(messageRole === "user") placeholder = "Write a message...";
                
                if(messageRole === "participant") {
                    if(typing !== null) placeholder = `${thisTask.currentTask.participant} is typing...`;
                    else placeholder = currentMessage.userContent;
                }

                return placeholder;
            }
        }
    }

    if(thisTask.currentTask.mode.type === "multipleChoice") {
        conversationAnswerP.innerText = currentMessage.userContent;

        const conversationAnswePHeight = getComputedStyle(conversationAnswerP).getPropertyValue("height");
                            
        conversationAnswerP.style.opacity = "1";
        conversationAnswerP.style.top = `-${conversationAnswePHeight}`;

        const conversationMessages = document.querySelector(".conversation-messages");
        const lastMessageHolder = conversationMessages.children[conversationMessages.children.length - 1];
        const lastMessage = lastMessageHolder.children[0];

        const messageRole = lastMessage.classList[0].split("-")[0];

        const conversationAnswerButtonHolder = generateMultipleChoiceButtons(showValidButtons());

        [...conversationAnswerButtonHolder.children].forEach((child, index) => {
            const className = thisTask.prevModeValues.multipleChoice.conversation.classes[index];

            if(className === "disabled-multiple-choice-button") child.disabled = true;
            child.classList.add(className);
        });

        function showValidButtons() {
            if(messageRole === "participant") {
                const typing = document.querySelector(".typing");

                if(typing !== null) return thisTask.currentTask.messages[messageNumber - 1];
                return currentMessage;
            }

            return thisTask.currentTask.messages[messageNumber - 1];
        }
    }

    function generateMultipleChoiceButtons(messageIndex) {    
        const validButton = messageIndex ? messageIndex : currentMessage;
        
        const buttonHolderSelector = document.querySelector(".conversation-answer-button-holder");
        if(buttonHolderSelector) buttonHolderSelector.innerHTML = "";
                    
        const conversationAnswerButtonHolder = buttonHolderSelector ? buttonHolderSelector : createElement({
            tag: "div",
            attributes: { class: "conversation-answer-button-holder" },
            appendTo: conversationAnswer
        });
                    
        validButton.options.forEach(option => createElement({
            tag: "button",
            attributes: { class: "multiple-choice-button" },
            innerText: option,
            events: [{ on: "click", call: e => optionChosen(e, option) }],
            appendTo: conversationAnswerButtonHolder
        }));

        return conversationAnswerButtonHolder;

        function optionChosen(e, option) {
            const button = e.target;
            button.classList.add("active-multiple-choice-button");

            checkMessage(e, option);
        }
    }

    function checkMessage(e, option) {
        if(e.type === "keydown" && e.key !== "Enter") return;
        
        const conversationAnswerInput = document.querySelector(".conversation-answer input");
        if((conversationAnswerInput === null || !conversationAnswerInput.value) && option === undefined) return;

        const userMessage = conversationAnswerInput ? conversationAnswerInput.value : option;
        let isCorrect = false;
                    
        currentMessage.acceptableAnswers.forEach(acceptableAnswer => {
            if(breakText(userMessage, { join: true }) === breakText(acceptableAnswer, { join: true })) isCorrect = true;
        });

        sendMessage(thisTask, { role: "user", content: userMessage, current: currentMessage });

        conversationAnswerP.style.opacity = "";
        conversationAnswerP.style.top = "";

        setTimeout(() => { conversationAnswerP.innerText = "" }, 300);

        if(conversationAnswer.classList.contains("active-conversation-answer")) conversationAnswer.classList.remove("active-conversation-answer");

        const conversationAnswerButtonHolder = document.querySelector(".conversation-answer-button-holder");
                    
        if(thisTask.currentTask.mode.type === "write") {
            conversationAnswerInput.value = "";
            conversationAnswerInput.disabled = true;
            conversationAnswerInput.placeholder = "Write a message...";
        }

        else [...conversationAnswerButtonHolder.children].forEach(child => {
            child.disabled = true;
            if(!child.classList.contains("active-multiple-choice-button")) child.classList.add("disabled-multiple-choice-button");
        });
                    
        const readingThinkingDuration = participantBehavior(userMessage, "readingThinking");

        if(isCorrect) {
            messageNumber++;
            currentMessage = thisTask.currentTask.messages[messageNumber];

            if(messageNumber > thisTask.currentTask.messages.length - 1) {
                if(conversationAnswer.classList.contains("active-conversation-answer")) conversationAnswer.classList.remove("active-conversation-answer");
                conversationAnswer.classList.add("disabled-conversation-answer");
                            
                messageNumber = 0;
                
                thisTask.answerChanged(userMessage);
                return thisTask.check(e, true);
            }
        }

        else messageNumber = 0;

        setTimeout(async () => {
            await sendMessage(thisTask, { role: "participant", isCorrect, current: currentMessage }, e);
            //if(thisTask.currentTask.mode.type === "multipleChoice") generateMultipleChoiceButtons();

        }, readingThinkingDuration);
    }
}