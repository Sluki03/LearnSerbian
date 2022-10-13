import taskInterface from "./interface.js";
import { sendMessage } from "./functions.js";
import { Component } from "../../../../components/Component.js";

export default function conversation(thisTask, changeMode) {
    if(changeMode) return taskInterface(thisTask, changeMode);
    
    const { taskHolder } = thisTask.elements;

    taskHolder.style.height = "70%";

    const exerciseModalTaskConversation = document.querySelector("[data-template='exercise-modal-task-conversation']").content.firstElementChild.cloneNode(true);
    taskHolder.appendChild(exerciseModalTaskConversation);

    const [conversationHolder] = [...exerciseModalTaskConversation.children];
    Component.render(conversationHolder);

    const [conversationParticipant] = [...conversationHolder.children];
    const [participantAvatar, participantName] = [...conversationParticipant.children];

    const participantAvatarLetter = participantAvatar.children[0];
    participantAvatarLetter.innerText = thisTask.currentTask.participant[0].toUpperCase();

    participantName.innerText = thisTask.currentTask.participant;

    taskInterface(thisTask, changeMode);
    sendMessage(thisTask, { role: "participant", current: thisTask.currentTask.messages[0] });
}