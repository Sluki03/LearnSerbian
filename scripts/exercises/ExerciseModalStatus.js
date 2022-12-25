import { Component } from "../components/Component.js";

export const ExerciseModalStatus = { open, close, restart };

let activeExerciseId = 0;

const body = document.querySelector("body");
const nav = document.querySelector("nav");
const scrollbar = document.querySelector("body .scrollbar");

function open(activeExercise, exercise, id = -1) {
    const [exerciseBorder, exerciseContent] = [...activeExercise.children];

    exerciseBorder.style.transform = "";

    exerciseContent.style.height = "";
    exerciseContent.style.width = "";
    
    const exerciseModal = document.querySelector(".exercise-modal");
    const exerciseHolder = activeExercise.parentNode;

    if(exerciseModal === null && activeExerciseId > 0) activeExerciseId = 0;
    if(activeExerciseId === id) return;
        
    if(activeExerciseId !== 0) ExerciseModalStatus.close(false, { activeExercise, exercise });
        
    else {
        body.style.overflow = "hidden";
        
        nav.style.opacity = "0";
        nav.style.top = "-65px";

        scrollbar.style.transition = "500ms";
        scrollbar.style.opacity = "0";
        scrollbar.style.right = "-10px";
        
        setTimeout(() => { scrollbar.style.display = "none" }, 500);

        exerciseHolder.id = "active-exercise-holder";
        Component.create("ExerciseModal", { exercise });
    }

    activeExerciseId = id;
}

function close(confirmed = false, openNew) {
    const taskConnectKeydown = window.eventList.get("taskConnectKeydown");
    const taskConnectActiveMultipleChoiceButton = document.querySelector(".connect-holder .active-multiple-choice-button");
    
    if(taskConnectKeydown !== null && taskConnectActiveMultipleChoiceButton !== null) return;
    
    const exerciseModal = document.querySelector(".exercise-modal");
    const activeExerciseHolder = document.getElementById("active-exercise-holder");

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
    activeExerciseHolder.id = "";

    setTimeout(() => {        
        body.style.overflow = "";
        scrollbar.style.display = "";

        setTimeout(() => {
            scrollbar.style.opacity = "";
            scrollbar.style.right = "";
            
            setTimeout(() => { scrollbar.style.transition = "" }, 500);
        }, 100);
        
        exerciseModal.remove();
        window.eventList.remove("exerciseModalContentKeyDown", "modalOptionsKeyDown");
        
        if(openNew !== undefined) {
            const { activeExercise, exercise } = openNew;
            ExerciseModalStatus.open(activeExercise, exercise);
        }
    }, 300);

    function confirmFunction() {
        ExerciseModalStatus.close(true, openNew);
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