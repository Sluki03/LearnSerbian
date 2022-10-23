import { Component } from "../components/Component.js";

export default function closeExerciseModal(confirmed, openNew) {    
    const taskConnectKeydown = window.eventList.get("taskConnectKeydown");
    const taskConnectActiveMultipleChoiceButton = document.querySelector(".active-multiple-choice-button");
    
    if(taskConnectKeydown !== null && taskConnectActiveMultipleChoiceButton !== null) return;
    
    const exerciseModal = document.querySelector(".exercise-modal");
    const activeExercise = document.getElementById("active-exercise");

    const exerciseModalTask = document.querySelector(".active-exercise-modal-task");

    if(exerciseModalTask !== null && !confirmed) return Component.create("ClassicModal", {
        text: "Do you really want to close the exercise?",
        buttons: ["no", "yes"],
        buttonsTrigger: { no: "Escape", yes: "Enter" },
        functions: { yes: confirmFunction },
        appendTo: exerciseModal
    });

    exerciseModal.id = "";
    activeExercise.id = "";

    setTimeout(() => {        
        exerciseModal.remove();
        window.eventList.remove("exerciseModalContentKeyDown", "modalOptionsKeyDown");
        
        if(openNew !== undefined) {
            const { activeExercise, exercise } = openNew;

            activeExercise.setAttribute("id", "active-exercise");
            Component.create("ExerciseModal", { exercise });
        }
    }, 300);

    function confirmFunction() {
        closeExerciseModal(true, openNew);
        window.eventList.remove("taskCheckKeyDown", "taskFunctionsSetActiveButton");
    }
}