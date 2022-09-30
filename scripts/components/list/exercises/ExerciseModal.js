import { exercisesData } from "../../../../data/exercises/index.js";
import { Component } from "../../Component.js";
import closeExerciseModal from "../../../exercises/closeExerciseModal.js";
import getVisiblePlaceholder from "../../../functions/getVisiblePlaceholder.js";

export default function ExerciseModal(componentProps) {
    const { exercise } = componentProps.params;

    const main = document.querySelector("main");
    const exerciseModal = document.querySelector("[data-template='exercise-modal']").content.firstElementChild.cloneNode(true);
    main.insertBefore(exerciseModal, main.firstChild);

    Component.render(exerciseModal);

    setTimeout(() => exerciseModal.setAttribute("id", "active-exercise-modal"), 100);

    Component.create("ModalOptions", {
        functions: { resize: modalOptionsResize, x: closeExerciseModal },
        appendTo: exerciseModal
    });

    function modalOptionsResize() {
        const textarea = document.querySelector("textarea");
        const input = document.querySelector("input");
        
        if(
            textarea && textarea.isEqualNode(document.activeElement) ||
            input && input.isEqualNode(document.activeElement)
        ) return true;
        
        const exerciseModalWith = parseInt(getComputedStyle(exerciseModal).getPropertyValue("width"));
        let isIconRotated = exerciseModalWith === window.innerWidth;
        
        if(exerciseModalWith !== window.innerWidth) exerciseModal.style.width = "100%";
        else exerciseModal.style.width = "";

        setTimeout(() => { if(input) getVisiblePlaceholder(input, getPlaceholderSource()) }, 300);

        return isIconRotated;

        function getPlaceholderSource() {
            const conversationAnswer = document.querySelector(".conversation-answer");
            const conversationAnswerInput = conversationAnswer.children[1];
            
            if(!input.isEqualNode(conversationAnswerInput)) return;

            let placeholderSource = "";

            exercisesData.forEach(exercise => {
                if(exercise.tasks === undefined) return;

                exercise.tasks.forEach(task => {
                    if(task.type !== "conversation") return;

                    task.messages.forEach(message => {
                        const inputPlaceholder = input.placeholder.substring(0, input.placeholder.length - 3);
                        if(message.userContent.includes(inputPlaceholder)) placeholderSource = message.userContent;
                    });
                });
            });

            return placeholderSource;
        }
    }

    Component.create("ExerciseModalContent", { exercise, appendTo: exerciseModal });

    return exerciseModal;
}