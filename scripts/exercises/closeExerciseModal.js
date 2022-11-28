import { Component } from "../components/Component.js";
import openExerciseModal from "./openExerciseModal.js";

export default function closeExerciseModal(confirmed, openNew) {    
    const taskConnectKeydown = window.eventList.get("taskConnectKeydown");
    const taskConnectActiveMultipleChoiceButton = document.querySelector(".connect-holder .active-multiple-choice-button");
    
    if(taskConnectKeydown !== null && taskConnectActiveMultipleChoiceButton !== null) return;
    
    const exerciseModal = document.querySelector(".exercise-modal");
    const activeExerciseHolder = document.getElementById("active-exercise-holder");

    const exerciseModalTask = document.querySelector(".active-exercise-modal-task");

    if(exerciseModalTask !== null && !confirmed) return Component.create("ClassicModal", {
        text: "Do you really want to close the exercise?",
        buttons: ["no", "yes"],
        buttonsTrigger: { no: "Escape", yes: "Enter" },
        functions: { yes: confirmFunction },
        appendTo: exerciseModal
    });

    exerciseModal.id = "";
    activeExerciseHolder.id = "";

    setTimeout(() => {        
        exerciseModal.remove();
        window.eventList.remove("exerciseModalContentKeyDown", "modalOptionsKeyDown");
        
        if(openNew !== undefined) {
            const { activeExercise, exercise } = openNew;
            openExerciseModal(activeExercise, exercise);
        }
    }, 300);

    function confirmFunction() {
        closeExerciseModal(true, openNew);
        window.eventList.remove("taskCheckKeyDown", "taskFunctionsSetActiveButton");
    }
}