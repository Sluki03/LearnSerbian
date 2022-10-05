import interace from "./interface.js";
import { sendMessage } from "./functions.js";
import { Component } from "../../../../components/Component.js";

export default function conversation(thisTask, changeMode) {
    if(changeMode) return interace(thisTask);
    
    const { taskHolder } = thisTask.elements;

    taskHolder.style.height = "70%";

    const conversationHolder = document.querySelector("[data-template='exercise-modal-task-conversation']").content.firstElementChild.cloneNode(true);
    taskHolder.appendChild(conversationHolder);
    Component.render(conversationHolder);

    const [conversationParticipant] = [...conversationHolder.children];
    const [participantAvatar, participantName] = [...conversationParticipant.children];
                
    const participantAvatarLetter = participantAvatar.children[0];
    participantAvatarLetter.innerText = thisTask.currentTask.participant[0].toUpperCase();

    participantName.innerText = thisTask.currentTask.participant;

    interace(thisTask);
    sendMessage(thisTask, { role: "participant", current: thisTask.currentTask.messages[0] });
}