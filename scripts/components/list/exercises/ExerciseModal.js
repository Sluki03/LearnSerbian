import { Component } from "../../Component.js";
import { ExerciseModalStatus } from "../../../exercises/ExerciseModalStatus.js";
import { NoteOptions } from "../../../functions/notes/NoteOptions.js";
import createElement from "../../../functions/element/createElement.js";

export default function ExerciseModal(componentProps) {
    const { builtIn } = componentProps;
    const { exercise, appendTo } = componentProps.params;

    const main = document.querySelector("main");

    const exerciseModal = builtIn ? builtIn : createElement({
        tag: "div",
        attributes: { class: "exercise-modal", id: "disabled-exercise-modal" },
        appendTo,
        before: main
    });

    setTimeout(() => exerciseModal.setAttribute("id", "active-exercise-modal"), 100);

    Component.create("ModalOptions", {
        functions: {
            notes: () => NoteOptions.openInModal("exercise"),
            restart: () => ExerciseModalStatus.restart(exercise, exerciseModal),
            x: ExerciseModalStatus.close
        },
        appendTo: exerciseModal
    });

    window.eventList.remove("exerciseModalReviewKeyDown");
    Component.create("ExerciseModalTask", { exercise, appendTo: exerciseModal });

    return exerciseModal;
}