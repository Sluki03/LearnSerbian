import { Component } from "../../Component.js";

export default function ExerciseModalReview(componentProps) {
    const { exercise, results, appendTo } = componentProps.params;

    const exerciseModalReview = document.querySelector("[data-template='exercise-modal-review']").content.firstElementChild.cloneNode(true);
    appendTo.appendChild(exerciseModalReview);

    const modalOptions = document.querySelector(".modal-options");
    const updatedModalOptions = Component.update(modalOptions, {
        options: ["return", "resize", "x"],
        functions: {...modalOptions.component.params.functions, return: modalOptionsReturn}
    });

    setTimeout(() => { exerciseModalReview.classList.add("active-exercise-modal-review") }, 100);

    function modalOptionsReturn() {
        exerciseModalReview.classList.remove("active-exercise-modal-review");

        setTimeout(() => {
            exerciseModalReview.remove();
            Component.create("ExerciseModalFinished", { exercise, appendTo });
            Component.update(updatedModalOptions, { options: null, functions: {...updatedModalOptions.component.params.functions, return: null} });
        }, 300);
    }

    return exerciseModalReview;
}