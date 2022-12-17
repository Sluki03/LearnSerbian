import { Component } from "../../../components/Component.js";
import createElement from "../../../functions/createElement.js";
import setTranslatableWords from "../../setTranslatableWords.js";

export default function conversation(reviewProps) {
    const { current, taskReview } = reviewProps;
    const { task, result } = current;
    
    const conversationHolder = Component.create("ConversationHolder", {
        conversationAnswerStatus: false,
        appendTo: taskReview
    });

    const [conversationParticipant, conversationMessages] = [...conversationHolder.children];
    const [participantAvatar, participantName] = [...conversationParticipant.children];

    const participantAvatarLetter = participantAvatar.children[0];
    participantAvatarLetter.innerText = task.participant[0].toUpperCase();

    participantName.innerText = task.participant;

    let stopMessages = false;
    
    task.messages.forEach((message, index) => {
        if(stopMessages) return;
        if(!result.isCorrect && (message.id === result.messageId)) stopMessages = true;

        const contents = [message.content, result.userAnswer[index]];
    
        contents.forEach((content, index) => {
            const role = index ? "user" : "participant";

            const messageHolder = createElement({
                tag: "div",
                attributes: { class: `${role}-message-holder` },
                appendTo: conversationMessages
            });

            const message = createElement({
                tag: "p",
                attributes: { class: `${role}-message ${stopMessages && index ? "invalid-message" : ""}` },
                appendTo: messageHolder
            });

            setTranslatableWords(message, content, task.translation, task.englishSerbian);
        });
    });
}