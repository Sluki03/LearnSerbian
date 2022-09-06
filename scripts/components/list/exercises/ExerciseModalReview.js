import { Component } from "../../Component.js";

export default function ExerciseModalReview(componentProps) {
    const [exercise, exerciseModal] = componentProps.params;

    const exerciseModalReview = document.querySelector("[data-template='exercise-modal-review']").content.firstElementChild.cloneNode(true);
    exerciseModal.appendChild(exerciseModalReview);

    const modalOptions = document.querySelector(".modal-options");

    Component.create("ModalOptions", exerciseModal);
    Component.update(modalOptions, ["return", "resize", "x"]);

    setTimeout(() => { exerciseModalReview.classList.add("active-exercise-modal-review") }, 100);

    return exerciseModalReview;
}