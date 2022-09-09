import { Component } from "../../Component.js";
import { Task } from "../../../exercises/task/Task.js";

export default function ExerciseModalTask(componentProps) {
    const { exercise, appendTo } = componentProps.params;
    
    const taskProgressBar = document.querySelector("[data-template='task-progress-bar']").content.firstElementChild.cloneNode(true);
    appendTo.appendChild(taskProgressBar);
    
    const exerciseModalTask = document.querySelector("[data-template='exercise-modal-task']").content.firstElementChild.cloneNode(true);
    appendTo.appendChild(exerciseModalTask);

    Component.render(exerciseModalTask);

    const classTask = new Task(taskProgressBar, exerciseModalTask, exercise);
    classTask.start();

    if(appendTo.scrollHeight < window.innerHeight) exerciseModalTask.id = "extended-exercise-modal-task";
    else exerciseModalTask.id = "";

    return exerciseModalTask;
}