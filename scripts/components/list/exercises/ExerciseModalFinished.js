import { Component } from "../../Component.js";

export default function ExerciseModalFinished(componentProps) {
    const { exercise, results, score, appendTo } = componentProps.params;

    const exerciseModalFinished = document.querySelector("[data-template='exercise-modal-finished']").content.firstElementChild.cloneNode(true);
    appendTo.appendChild(exerciseModalFinished);

    const [finishedHolder, continueButton] = [...exerciseModalFinished.children];

    continueButton.onclick = continueToStart;
    window.addEventListener("keydown", continueToStart);

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

    const overviewBlockStrong = document.querySelectorAll(".overview-block strong");
    const scorePropOrder = ["xp", "correct", "mistakes"];
    const suffix = [" XP", "%"];

    overviewBlockStrong.forEach((strong, index) => {
        let scoreValue;

        Object.keys(score).forEach((key, scoreIndex) => {
            if(scorePropOrder[index] === key) scoreValue = Object.values(score)[scoreIndex];
        });

        strong.innerText = scoreValue + (suffix[index] ? suffix[index] : "");
    });

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
            window.removeEventListener("keydown", continueToStart);

            Component.create("ExerciseModalReview", { exercise, results, score, appendTo });
        }, 300);
    }

    function continueToStart(e) {     
        if(e.key !== "Enter" && e.type === "keydown") return;
        window.removeEventListener("keydown", continueToStart);
        
        finishedHolder.classList.remove("active-finished-holder");
        continueButton.style.bottom = "-100px";

        setTimeout(() => {
            exerciseModalTitle.remove();
            exerciseModalDivider.remove();
            
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