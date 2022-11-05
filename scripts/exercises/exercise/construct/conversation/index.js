import taskInterface from "./interface.js";
import { sendMessage } from "./functions.js";
import { Component } from "../../../../components/Component.js";

export default function conversation(thisExercise, changeMode) {
    if(changeMode) return taskInterface(thisExercise, changeMode);
    
    const { taskHolder } = thisExercise.elements;

    taskHolder.style.height = "70%";

    const exerciseModalTaskConversation = document.querySelector("[data-template='exercise-modal-task-conversation']").content.firstElementChild.cloneNode(true);
    taskHolder.appendChild(exerciseModalTaskConversation);

    const [conversationHolder] = [...exerciseModalTaskConversation.children];
    Component.render(conversationHolder);

    const [conversationParticipant] = [...conversationHolder.children];
    const [participantAvatar, participantName] = [...conversationParticipant.children];

    const participantAvatarLetter = participantAvatar.children[0];
    participantAvatarLetter.innerText = thisExercise.currentTask.participant[0].toUpperCase();

    participantName.innerText = thisExercise.currentTask.participant;

    taskInterface(thisExercise, changeMode);
    sendMessage(thisExercise, { role: "participant", current: thisExercise.currentTask.messages[0] });
}