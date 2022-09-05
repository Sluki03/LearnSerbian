export default function ExerciseModalReview(componentProps) {
    const [exercise, exerciseModal] = componentProps.params;

    const exerciseModalReview = document.querySelector("[data-template='exercise-modal-review']").content.firstElementChild.cloneNode(true);
    exerciseModal.appendChild(exerciseModalReview);

    setTimeout(() => { exerciseModalReview.classList.add("active-exercise-modal-review") }, 100);

    return exerciseModalReview;
}