import createElement from "../../../functions/createElement.js";

export default function singleTask(componentProps) {
    const [tasks, exerciseModal] = componentProps.params;
    let taskNumber = 0;

    const task = tasks[taskNumber];
    
    const exerciseModalTask = document.querySelector("[data-template='exercise-modal-task']").content.firstElementChild.cloneNode(true);
    exerciseModal.appendChild(exerciseModalTask);

    setTimeout(() => { exerciseModalTask.classList.add("active-exercise-modal-task") }, 100);

    const [taskH3, taskHolder, checkButton, taskInfo] = [...exerciseModalTask.children];
    const [taskInfoImg, taskInfoText] = [...taskInfo.children];
    const [taskInfoH4, taskInfoP] = [...taskInfoText.children];
    
    taskH3.innerText = task.title;

    checkButton.onclick = check;
    window.addEventListener("keydown", check);

    let answer;
    
    constructTask();

    if(exerciseModal.scrollHeight < window.innerHeight) exerciseModalTask.id = "extended-exercise-modal-task";
    else exerciseModalTask.id = "";

    return exerciseModalTask;

    function answerChanged(newAnswer) {
        answer = newAnswer;

        if(answer) checkButton.id = "";
        else if(!checkButton.id) checkButton.id = "disabled-check-button";
    }

    function check(event) {
        if(event.key !== "Enter" || checkButton.id === "disabled-check-button") return;

        const image = { correct: "./images/icons/circle-check.svg", incorrect: "./images/icons/circle-x.svg" };
        
        const green = { normal: "#059c20", light: "#07db2d", lighter: "#00ff2e" };
        const red = { normal: "#bd1330", light: "#d91435", lighter: "#f20707" };
        
        taskInfo.style.bottom = "0";
        
        if(task.constructor.acceptableAnswers.indexOf(answer) > -1) {
            taskInfo.style.background = getLinearGradient(true);

            taskInfoImg.src = image.correct;
            
            taskInfoH4.innerText = task.constructor.correct.title;
            taskInfoP.innerText = task.constructor.correct.text;
        }
        
        else {
            taskInfo.style.background = getLinearGradient(false);

            taskInfoImg.src = image.incorrect;
            
            taskInfoH4.innerText = task.constructor.incorrect.title;
            taskInfoP.innerText = task.constructor.incorrect.text;
        }

        function getLinearGradient(isCorrect) {
            const color = isCorrect ? green : red;
            const { normal, light, lighter } = color;

            const linearGradient = `linear-gradient(135deg, ${normal} 65%, ${light} 65% 85%, ${lighter} 85%)`;
            return linearGradient;
        }
    }
    
    function constructTask() {
        switch(task.type) {
            case "multipleChoice": {
                const multipleChoiceHolder = createElement({
                    tag: "div",
                    attributes: { class: "multiple-choice-holder" },
                    appendTo: taskHolder
                });
                
                for(let i = 0; i < task.constructor.options.length; i++) {
                    const multipleChoiceButton = createElement({
                        tag: "button",
                        attributes: { class: "multiple-choice-button", id: `multiple-choice-button-${i + 1}` },
                        innerText: task.constructor.options[i],
                        events: [{ on: "click", call: () => setActiveButton(i + 1) }],
                        appendTo: multipleChoiceHolder
                    });

                    createElement({
                        tag: "span",
                        attributes: { class: "multiple-choice-span" },
                        innerText: i + 1,
                        appendTo: multipleChoiceButton
                    });
                }

                window.addEventListener("keydown", (event) => setActiveButton(parseInt(event.key)));

                function setActiveButton(id) {
                    if(isNaN(id) || id > task.constructor.options.length) return;
                    
                    const allButtons = document.querySelectorAll(".multiple-choice-button");
                    const buttonId = `multiple-choice-button-${id}`;

                    allButtons.forEach(button => {
                        if(button.classList.contains("active-multiple-choice-button") && button.id !== buttonId) button.classList.remove("active-multiple-choice-button");
                        
                        if(button.id === buttonId) {
                            button.classList.add("active-multiple-choice-button");
                            answerChanged(task.constructor.options[id - 1]);
                        }
                    });
                }
                
                break;
            }
            
            default: return;
        }
    }
}