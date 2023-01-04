import createElement from "../../../functions/element/createElement.js";

export default function ConversationHolder(componentProps) {
    const { builtIn } = componentProps;
    const { conversationAnswerStatus, appendTo } = componentProps.params;

    const conversationHolder = builtIn ? builtIn : createElement({
        tag: "div",
        attributes: { class: "conversation-holder" },
        appendTo
    });

    const conversationHolderParts = [
        "conversation-participant",
        "conversation-messages",
        (conversationAnswerStatus ? "conversation-answer interface" : "")
    ];

    conversationHolderParts.forEach(part => {
        if(!part) return;

        createElement({
            tag: "div",
            attributes: { class: part },
            appendTo: conversationHolder
        });
    });
    
    const conversationParticipant = document.querySelector(".conversation-participant");

    createElement({
        tag: "div",
        attributes: { class: "avatar" },
        innerHTML: "<span></span>",
        appendTo: conversationParticipant
    });

    createElement({
        tag: "strong",
        appendTo: conversationParticipant
    });

    return conversationHolder;
}