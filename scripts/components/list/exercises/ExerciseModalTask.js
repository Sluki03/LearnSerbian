import { Component } from "../../Component.js";
import { Exercise } from "../../../exercises/exercise/Exercise.js";

export default function ExerciseModalTask(componentProps) {
    const { exercise, appendTo } = componentProps.params;
    
    const taskLives = document.querySelector("[data-template='task-lives']").content.firstElementChild.cloneNode(true);
    appendTo.appendChild(taskLives);
    
    const taskProgressBarHolder = document.querySelector("[data-template='task-progress-bar-holder']").content.firstElementChild.cloneNode(true);
    appendTo.appendChild(taskProgressBarHolder);
    
    const exerciseModalTask = document.querySelector("[data-template='exercise-modal-task']").content.firstElementChild.cloneNode(true);
    appendTo.appendChild(exerciseModalTask);

    Component.render(exerciseModalTask);

    const classExercise = new Exercise(exerciseModalTask, exercise);
    classExercise.start();

    return exerciseModalTask;
}