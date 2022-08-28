import createComponent from "../functions/createComponent.js";

export default function closeExerciseModal(openNew) {
    const exerciseModal = document.querySelector(".exercise-modal");
    const activeExercise = document.getElementById("active-exercise");

    exerciseModal.id = "";
    activeExercise.id = "";

    setTimeout(() => {        
        exerciseModal.id = "disabled-exercise-modal";
        cleanup(".exercise-modal-title", ".content-difficulty .content-difficulty-circles", ".content-difficulty i");
        
        if(openNew !== undefined) {
            const { activeExercise, exercise } = openNew;

            activeExercise.setAttribute("id", "active-exercise");
            createComponent("singleExercise", exercise);
        }
    }, 300);

    function cleanup(...selectors) {
        for(let i = 0; i < selectors.length; i++) {
            const selectedElement = document.querySelector(selectors[i]);
            selectedElement.innerHTML = "";
        }
    }
}