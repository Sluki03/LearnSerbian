import createElement from "../../../functions/createElement.js";

export default function singleTask(componentProps) {
    const [tasks, appendTo] = componentProps.params;
    let taskNumber = 0;

    const task = tasks[taskNumber];
    
    const exerciseModalTask = document.querySelector("[data-template='exercise-modal-task']").content.firstElementChild.cloneNode(true);
    appendTo.appendChild(exerciseModalTask);

    setTimeout(() => { exerciseModalTask.id = "active-exercise-modal-task" }, 100);

    const [taskH3, taskHolder] = [...exerciseModalTask.children];
    taskH3.innerText = task.title;
    
    constructTask();

    return exerciseModalTask;

    function constructTask() {
        switch(task.type) {
            case "multipleChoice": {
                const multipleChoiceHolder = createElement({
                    tag: "div",
                    attributes: { class: "multiple-choice-holder" },
                    appendTo: taskHolder
                });
                
                for(let i = 0; i < task.constructor.options.length; i++) createElement({
                    tag: "button",
                    attributes: { class: "multiple-choice-button" },
                    innerText: task.constructor.options[i],
                    appendTo: multipleChoiceHolder
                });
                
                break;
            }
            
            default: return;
        }
    }
}