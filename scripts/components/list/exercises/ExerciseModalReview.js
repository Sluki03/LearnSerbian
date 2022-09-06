import { Component } from "../../Component.js";

export default function ExerciseModalReview(componentProps) {
    const { appendTo } = componentProps.params;

    const exerciseModalReview = document.querySelector("[data-template='exercise-modal-review']").content.firstElementChild.cloneNode(true);
    appendTo.appendChild(exerciseModalReview);

    const modalOptions = document.querySelector(".modal-options");
    Component.update("ModalOptions", modalOptions, { options: ["return", "resize", "x"] });

    setTimeout(() => { exerciseModalReview.classList.add("active-exercise-modal-review") }, 100);

    return exerciseModalReview;
}