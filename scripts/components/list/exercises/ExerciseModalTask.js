import { Component } from "../../Component.js";
import { Task } from "../../../exercises/task/Task.js";

export default function ExerciseModalTask(componentProps) {
    const [exercise, exerciseModal] = componentProps.params;
    
    const exerciseModalTask = document.querySelector("[data-template='exercise-modal-task']").content.firstElementChild.cloneNode(true);
    exerciseModal.appendChild(exerciseModalTask);

    Component.render(exerciseModalTask);

    const classTask = new Task(exerciseModalTask, exercise);
    classTask.start();

    if(exerciseModal.scrollHeight < window.innerHeight) exerciseModalTask.id = "extended-exercise-modal-task";
    else exerciseModalTask.id = "";

    return exerciseModalTask;
}