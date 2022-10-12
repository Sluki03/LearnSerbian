import { Component } from "../../../../components/Component.js";
import { sendMessage, participantBehavior, getInputMaxLength, buttonTyping, translationModal } from "./functions.js";
import createElement from "../../../../functions/createElement.js";
import breakText from "../../../../functions/breakText.js";
import randomArray from "../../../../functions/randomArray.js";

export default async function taskInterface(thisTask, changeMode) {
    let currentMessage = thisTask.currentTask.messages[thisTask.messageNumber];
    
    const conversationAnswer = document.querySelector(".conversation-answer");
    createElement({ tag: "p", appendTo: conversationAnswer });
    
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
                translationModal(currentMessage.userContent);
            }
                        
            else if(conversationAnswer.classList.contains("active-conversation-answer")) {
                conversationAnswer.classList.remove("active-conversation-answer");
                translationModal(currentMessage.userContent, "down");
            }
        }

        function resetInput() {
            conversationAnswerInput.value = thisTask.prevModeValues.write.conversation.value;
            
            const conversationMessages = document.querySelector(".conversation-messages");
            const lastMessageHolder = conversationMessages.children[conversationMessages.children.length - 1];
            const lastMessage = lastMessageHolder.children[0];

            const messageRole = lastMessage.classList[0].split("-")[0];

            if(thisTask.messageNumber > thisTask.currentTask.messages.length - 1) return;

            const { disabled, placeholder } = getInputValues();
            
            conversationAnswerInput.disabled = disabled;
            conversationAnswerInput.placeholder = placeholder;
            conversationAnswerInput.focus();

            function getInputValues() {
                let values = {
                    disabled: true,
                    placeholder: ""
                };
                
                const typing = document.querySelector(".typing");
                
                if(messageRole === "user") values.placeholder = "Write a message...";
                
                if(messageRole === "participant") {
                    if(typing !== null) values.placeholder = `${thisTask.currentTask.participant} is typing...`;
                    else values = { disabled: false, placeholder: currentMessage.userContent };
                }

                return values;
            }
        }
    }

    if(thisTask.currentTask.mode.type === "multipleChoice") {        
        const typing = document.querySelector(".typing");
        const messageRole = getMessageRole();

        if(typing === null && messageRole === "participant") translationModal(currentMessage.userContent);

        const conversationAnswerButtonHolder = generateMultipleChoiceButtons(showValidButtons());

        [...conversationAnswerButtonHolder.children].forEach((child, index) => {
            const className = thisTask.prevModeValues.multipleChoice.conversation.classes[index];
            if(className === undefined) return;

            child.disabled = true;
            child.classList.add(className);
        });

        const activeMultipleChoiceButton = document.querySelector(".active-multiple-choice-button");
        if(activeMultipleChoiceButton === null && (typing !== null || messageRole === "user")) buttonTyping(currentMessage);
        
        function getMessageRole() {
            const conversationMessages = document.querySelector(".conversation-messages");

            if(conversationMessages.children.length === 0) return "participant";

            const lastMessageHolder = conversationMessages.children[conversationMessages.children.length - 1];
            const lastMessage = lastMessageHolder.children[0];

            return lastMessage.classList[0].split("-")[0];
        }
        
        function showValidButtons() {
            if(messageRole === "participant") {
                if(typing !== null) return thisTask.currentTask.messages[thisTask.messageNumber - 1];
                return currentMessage;
            }

            return thisTask.currentTask.messages[thisTask.messageNumber - 1];
        }
    }

    thisTask.switchModes(currentMessage);

    function generateMultipleChoiceButtons(messageIndex) {    
        const validButton = messageIndex ? messageIndex : currentMessage;
        
        const buttonHolderSelector = document.querySelector(".conversation-answer-button-holder");
        if(buttonHolderSelector) buttonHolderSelector.innerHTML = "";
                    
        const conversationAnswerButtonHolder = buttonHolderSelector ? buttonHolderSelector : createElement({
            tag: "div",
            attributes: { class: "conversation-answer-button-holder" },
            appendTo: conversationAnswer
        });

        const randomOptions = randomArray(validButton.options);
                    
        randomOptions.forEach(option => createElement({
            tag: "button",
            attributes: { class: "multiple-choice-button" },
            innerText: option,
            events: [{ on: "click", call: e => optionChosen(e, option) }],
            appendTo: conversationAnswerButtonHolder
        }));

        window.eventList.add({ id: "taskOptionChooseKeydown", type: "keydown", listener: optionChosen });

        return conversationAnswerButtonHolder;

        function optionChosen(e, option) {
            const keyRules = (parseInt(e.key) <= validButton.options.length) && (parseInt(e.key) > 0) && !isNaN(parseInt(e.key));
            if(e.type === "keydown" && !keyRules) return;
            
            const button = e.type === "keydown" ? conversationAnswerButtonHolder.children[parseInt(e.key) - 1] : e.target;
            button.classList.add("active-multiple-choice-button");

            checkMessage(e, e.type === "keydown" ? button.innerText : option, true);
            window.eventList.remove("taskOptionChooseKeydown");
        }
    }

    function checkMessage(e, option, additionalPass = false) {
        if(e.type === "keydown" && e.key !== "Enter" && !additionalPass) return;
        
        const conversationAnswerInput = document.querySelector(".conversation-answer input");
        if((conversationAnswerInput === null || !conversationAnswerInput.value) && option === undefined) return;

        const userMessage = conversationAnswerInput ? conversationAnswerInput.value : option;
        let isCorrect = false;
                    
        currentMessage.acceptableAnswers.forEach(acceptableAnswer => {
            if(breakText(userMessage, { join: true }) === breakText(acceptableAnswer, { join: true })) isCorrect = true;
        });

        sendMessage(thisTask, { role: "user", content: userMessage, current: currentMessage });
        translationModal(currentMessage.userContent, "down");

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
            if(thisTask.messageNumber === thisTask.currentTask.messages.length - 1) {
                if(conversationAnswer.classList.contains("active-conversation-answer")) conversationAnswer.classList.remove("active-conversation-answer");
                conversationAnswer.classList.add("disabled-conversation-answer");
                
                thisTask.answerChanged(userMessage);
                return thisTask.check(e, true);
            }

            thisTask.messageNumber++;
            currentMessage = thisTask.currentTask.messages[thisTask.messageNumber];
        }

        setTimeout(async () => {
            await sendMessage(thisTask, { role: "participant", isCorrect, current: currentMessage }, e);
            
            if(!isCorrect) return;

            if(thisTask.currentTask.mode.type === "multipleChoice") {
                generateMultipleChoiceButtons();
                translationModal(currentMessage.userContent);
            }

            else thisTask.prevModeValues.multipleChoice.conversation.classes = [];

        }, readingThinkingDuration);
    }
}