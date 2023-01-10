import { Component } from "../components/Component.js";

export const ExerciseModalStatus = { open, close, restart };

let activeExerciseId = -1;

const body = document.querySelector("body");
const nav = document.querySelector("nav");
const scrollbar = document.querySelector("body .scrollbar");

function open(exercise, id) {
    const exerciseHolder = document.querySelectorAll(".exercise-holder")[id];

    if(activeExerciseId === id) return;
    if(activeExerciseId !== -1) close(false);
        
    else {
        body.style.overflow = "hidden";
        
        nav.style.opacity = "0";
        nav.style.top = "-65px";

        scrollbar.style.transition = "500ms";
        scrollbar.style.opacity = "0";
        scrollbar.style.right = "-10px";
        
        setTimeout(() => { scrollbar.style.display = "none" }, 500);

        exerciseHolder.classList.add("active-exercise-holder");
        Component.create("ExerciseModal", { exercise, appendTo: body });
    }

    activeExerciseId = id;
}

function close(confirmed = false) {
    const taskConnectKeydown = window.eventList.get("taskConnectKeydown");
    const taskConnectActiveMultipleChoiceButton = document.querySelector(".connect-holder .active-multiple-choice-button");
    
    if(taskConnectKeydown !== null && taskConnectActiveMultipleChoiceButton !== null) return;
    
    const exerciseModal = document.querySelector(".exercise-modal");
    const activeExerciseHolder = document.querySelector(".active-exercise-holder");

    if(exerciseModal === null || activeExerciseHolder === null) return;

    const exerciseModalTask = document.querySelector(".active-exercise-modal-task");

    if(exerciseModalTask !== null && !confirmed) return Component.create("ClassicModal", {
        text: "Do you really want to close the exercise?",
        buttons: ["no", "yes"],
        buttonsTrigger: { no: "Escape", yes: "Enter" },
        functions: { yes: confirmFunction },
        appendTo: exerciseModal
    });
    
    nav.style.opacity = "";
    nav.style.top = "";

    exerciseModal.id = "";
    activeExerciseHolder.classList.remove("active-exercise-holder");

    setTimeout(() => {        
        body.style.overflow = "";
        scrollbar.style.display = "";

        setTimeout(() => {
            scrollbar.style.opacity = "";
            scrollbar.style.right = "";
            
            setTimeout(() => { scrollbar.style.transition = "" }, 500);
        }, 100);
        
        exerciseModal.remove();
        window.eventList.remove("exerciseModalContentKeyDown");

        activeExerciseId = -1;
    }, 300);

    function confirmFunction() {
        ExerciseModalStatus.close(true);
        window.eventList.remove("taskCheckKeyDown", "taskFunctionsSetActiveButton");
    }
}

let inProgress = false;

function restart(exercise, appendTo) {
    if(inProgress) return;
    inProgress = true;

    window.eventList.remove("exerciseModalReviewKeyDown");
    
    const exerciseModalTask = document.querySelector(".exercise-modal-task");
    const exerciseModalReview = document.querySelector(".exercise-modal-review");

    if(exerciseModalTask !== null) return Component.create("ClassicModal", {
        text: "Do you really want to restart the exercise?",
        buttons: ["no", "yes"],
        buttonsTrigger: { no: "Escape", yes: "Enter" },
        functions: { yes: confirmFunction, no: () => { inProgress = false } },
        appendTo
    });

    else confirmFunction();

    function confirmFunction() {
        let targetExerciseModal = null;
        
        targetExerciseModal = exerciseModalTask === null ? exerciseModalReview : exerciseModalTask;
        targetExerciseModal.classList.remove(`active-exercise-modal-${exerciseModalTask === null ? "review" : "task"}`);

        setTimeout(() => {
            const isExerciseModalTaskTarget = exerciseModalTask !== null;
            
            if(isExerciseModalTaskTarget) {
                const taskLives = document.querySelector(".task-lives");
                const taskProgressBarHolder = document.querySelector(".task-progress-bar-holder");

                taskLives.remove();
                taskProgressBarHolder.remove();
            }
            
            targetExerciseModal.remove();
            
            const exerciseModalContent = Component.create("ExerciseModalTask", { exercise, appendTo });

            setTimeout(() => {
                exerciseModalContent.style.opacity = "";
                exerciseModalContent.style.left = "";

                inProgress = false;
            }, 100);
        }, 300);
    }
}