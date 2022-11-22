import { Component } from "../../../../components/Component.js";
import { sendMessage, participantBehavior, getInputMaxLength, buttonTyping, translationModal } from "./functions.js";
import createElement from "../../../../functions/createElement.js";
import breakText from "../../../../functions/breakText.js";
import randomArray from "../../../../functions/randomArray.js";

export default async function taskInterface(thisExercise, changeMode) {
    let currentMessage = thisExercise.currentTask.messages[thisExercise.messageNumber];
    
    const exerciseModalTaskConversation = document.querySelector(".exercise-modal-task-conversation");
    const conversationAnswer = document.querySelector(".conversation-answer");

    createElement({ tag: "p", appendTo: conversationAnswer });

    const diacriticKeyboard = document.querySelector(".diacritic-keyboard");
    if(diacriticKeyboard !== null) diacriticKeyboard.remove();
    
    if(thisExercise.currentTask.mode.type === "write") {
        const conversationAnswerInput = createElement({
            tag: "input",
            attributes: { type: "text" },
            appendTo: conversationAnswer
        });
        
        if(changeMode) resetInput();

        if(thisExercise.currentTask.diacriticKeyboard || thisExercise.currentTask.diacriticKeyboard === undefined) Component.create("DiacriticKeyboard", {
            input: conversationAnswerInput,
            answerChanged: thisExercise.answerChanged,
            smaller: true,
            appendTo: exerciseModalTaskConversation
        });

        const conversationAnswerCheckButton = Component.create("ArrowButton", { appendTo: conversationAnswer });

        conversationAnswerInput.maxLength = getInputMaxLength(currentMessage);
        conversationAnswerInput.oninput = changeConversationAnswerStatus;

        conversationAnswerCheckButton.onclick = e => checkMessage(e);
        
        window.eventList.add({ id: "taskCheckMessageKeyDown", type: "keydown", listener: checkMessage });

        changeConversationAnswerStatus();

        function resetInput() {
            conversationAnswerInput.value = thisExercise.prevModeValues.write.conversation.value;
            
            const conversationMessages = document.querySelector(".conversation-messages");
            const lastMessageHolder = conversationMessages.children[conversationMessages.children.length - 1];
            const lastMessage = lastMessageHolder.children[0];

            const messageRole = lastMessage.classList[0].split("-")[0];

            if(thisExercise.messageNumber > thisExercise.currentTask.messages.length - 1) return;

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
                    if(typing !== null) values.placeholder = `${thisExercise.currentTask.participant} is typing...`;
                    else values = { disabled: false, placeholder: currentMessage.userContent };
                }

                return values;
            }
        }
    }

    else {
        const typing = document.querySelector(".typing");
        const messageRole = getMessageRole();

        if(typing === null && messageRole === "participant") translationModal(currentMessage.userContent);

        const conversationAnswerButtonHolder = generateMultipleChoiceButtons(showValidButtons());

        [...conversationAnswerButtonHolder.children].forEach((child, index) => {
            const className = thisExercise.prevModeValues.multipleChoice.conversation.classes[index];
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
                if(typing !== null) return thisExercise.currentTask.messages[thisExercise.messageNumber - 1];
                return currentMessage;
            }

            return thisExercise.currentTask.messages[thisExercise.messageNumber - 1];
        }
    }

    thisExercise.switchModes(currentMessage);

    function changeConversationAnswerStatus() {
        const conversationHolder = conversationAnswer.parentElement;

        const conversationAnswerInput = document.querySelector(".conversation-answer input");
        const diacriticKeyboard = document.querySelector(".diacritic-keyboard");
        
        if(conversationAnswerInput.value) {
            conversationAnswer.classList.add("active-conversation-answer");
            
            if(diacriticKeyboard) {
                diacriticKeyboard.classList.add("active-diacritic-keyboard");

                const diacriticKeyboardHeight = parseInt(getComputedStyle(diacriticKeyboard).getPropertyValue("height"));
                const gap = 10;
                
                conversationHolder.style.height = `calc(100% - ${diacriticKeyboardHeight + gap}px)`;
            }

            translationModal(currentMessage.userContent);
        }
                    
        else if(conversationAnswer.classList.contains("active-conversation-answer")) {
            conversationAnswer.classList.remove("active-conversation-answer");
            if(diacriticKeyboard) diacriticKeyboard.classList.remove("active-diacritic-keyboard");
            
            conversationHolder.style.height = "";
            
            translationModal(currentMessage.userContent, "down");
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

        sendMessage(thisExercise, { role: "user", content: userMessage, current: currentMessage });
        translationModal(currentMessage.userContent, "down");

        const conversationAnswerButtonHolder = document.querySelector(".conversation-answer-button-holder");
                    
        if(thisExercise.currentTask.mode.type === "write") {
            conversationAnswerInput.value = "";
            conversationAnswerInput.disabled = true;
            conversationAnswerInput.placeholder = "Write a message...";

            changeConversationAnswerStatus();
        }

        else [...conversationAnswerButtonHolder.children].forEach(child => {
            child.disabled = true;
            if(!child.classList.contains("active-multiple-choice-button")) child.classList.add("disabled-multiple-choice-button");
        });
                    
        const readingThinkingDuration = participantBehavior(userMessage, "readingThinking");

        if(isCorrect) {
            if(thisExercise.messageNumber === thisExercise.currentTask.messages.length - 1) {
                conversationAnswer.classList.remove("active-conversation-answer");
                conversationAnswer.classList.add("disabled-conversation-answer");
                
                window.eventList.remove("taskOptionChooseKeydown", "taskCheckMessageKeyDown");

                thisExercise.answerChanged(userMessage);
                return thisExercise.check(e, true);
            }

            thisExercise.messageNumber++;
            currentMessage = thisExercise.currentTask.messages[thisExercise.messageNumber];
        }

        setTimeout(async () => {
            await sendMessage(thisExercise, { role: "participant", isCorrect, current: currentMessage }, e);
            
            if(!isCorrect) return;

            if(thisExercise.currentTask.mode.type === "multipleChoice") {
                generateMultipleChoiceButtons();
                translationModal(currentMessage.userContent);
            }

            else thisExercise.prevModeValues.multipleChoice.conversation.classes = [];

        }, readingThinkingDuration);
    }
}