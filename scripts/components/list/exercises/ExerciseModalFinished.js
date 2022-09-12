import { Component } from "../../Component.js";

export default function ExerciseModalFinished(componentProps) {
    const { exercise, results, appendTo } = componentProps.params;

    const exerciseModalFinished = document.querySelector("[data-template='exercise-modal-finished']").content.firstElementChild.cloneNode(true);
    appendTo.appendChild(exerciseModalFinished);

    const [finishedHolder, continueButton] = [...exerciseModalFinished.children];

    const exerciseModalTitleDivider = document.querySelector("[data-template='exercise-modal-title-divider']").content.firstElementChild.cloneNode(true);
    const [exerciseModalTitle, exerciseModalDivider] = [...exerciseModalTitleDivider.children];

    exerciseModalTitle.classList.add("disabled-exercise-modal-title");

    appendTo.insertBefore(exerciseModalTitle, exerciseModalFinished);
    appendTo.insertBefore(exerciseModalDivider, exerciseModalFinished);
    
    exerciseModalDivider.style.opacity = "0";
    exerciseModalDivider.style.top = "-10px";

    continueButton.style.bottom = "-100px";

    setTimeout(() => {
        exerciseModalTitle.classList.remove("disabled-exercise-modal-title");
        finishedHolder.classList.add("active-finished-holder");

        exerciseModalDivider.style.opacity = "";
        exerciseModalDivider.style.top = "";

        continueButton.style.bottom = "";
    }, 100);

    Component.create("InteractiveTitle", { title: exercise.name, appendTo: exerciseModalTitle });
    
    const activeExerciseClone = document.getElementById("active-exercise").cloneNode(true);
    
    activeExerciseClone.id = "";
    activeExerciseClone.classList.add("exercise-clone");

    exerciseModalTitle.appendChild(activeExerciseClone);

    const overviewHolder = [...finishedHolder.children][1];

    const reviewButton = document.querySelector(".finished-holder button");

    reviewButton.onclick = () => {
        exerciseModalTitle.classList.add("disabled-exercise-modal-title");

        exerciseModalDivider.style.opacity = "0";
        exerciseModalDivider.style.top = "-10px";

        finishedHolder.style.opacity = "0";
        finishedHolder.style.left = "-20px";

        continueButton.style.bottom = "-100px";

        setTimeout(() => {
            exerciseModalTitle.remove();
            exerciseModalDivider.remove();

            exerciseModalFinished.remove();

            Component.create("ExerciseModalReview", { exercise, results, appendTo });
        }, 300);
    }

    continueButton.onclick = () => {
        finishedHolder.classList.remove("active-finished-holder");
        continueButton.style.bottom = "-100px";

        setTimeout(() => {
            exerciseModalFinished.remove();
            
            const exerciseModalContent = Component.create("ExerciseModalContent", {
                exercise,
                appendTo,
                style: { opacity: "0", left: "-20px" }
            });

            setTimeout(() => {
                exerciseModalContent.style.opacity = "";
                exerciseModalContent.style.left = "";
            }, 100);
        }, 300);
    }

    return exerciseModalFinished;
}