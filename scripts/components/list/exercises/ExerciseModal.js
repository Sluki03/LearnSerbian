import { Component } from "../../Component.js";
import { ExerciseModalStatus } from "../../../exercises/ExerciseModalStatus.js";

export default function ExerciseModal(componentProps) {
    const { exercise } = componentProps.params;

    const body = document.querySelector("body");
    const main = document.querySelector("main");

    const exerciseModal = document.querySelector("[data-template='exercise-modal']").content.firstElementChild.cloneNode(true);
    body.insertBefore(exerciseModal, main);

    Component.render(exerciseModal);

    setTimeout(() => exerciseModal.setAttribute("id", "active-exercise-modal"), 100);

    Component.create("ModalOptions", {
        functions: {
            restart: () => ExerciseModalStatus.restart(exercise, exerciseModal),
            x: ExerciseModalStatus.close
        },
        appendTo: exerciseModal
    });

    window.eventList.remove("exerciseModalReviewKeyDown");
    Component.create("ExerciseModalTask", { exercise, appendTo: exerciseModal });

    return exerciseModal;
}