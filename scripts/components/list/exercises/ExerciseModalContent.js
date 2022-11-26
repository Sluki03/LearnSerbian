import { Component } from "../../Component.js";
import markup from "../../../functions/markup.js";
import { Styles } from "../../../functions/Styles.js";
import realParseInt from "../../../functions/realParseInt.js";

export default function ExerciseModalContent(componentProps) {
    const { exercise, appendTo, style, titleStyle } = componentProps.params;

    const exerciseModalTitleDivider = document.querySelector("[data-template='exercise-modal-title-divider']").content.firstElementChild.cloneNode(true);
    const [exerciseModalTitle, exerciseModalDivider] = [...exerciseModalTitleDivider.children];

    appendTo.appendChild(exerciseModalTitle);
    appendTo.appendChild(exerciseModalDivider);

    Component.create("InteractiveTitle", { title: exercise.name, appendTo: exerciseModalTitle });

    const activeExerciseClone = document.getElementById("active-exercise-holder").children[0].cloneNode(true);
    
    activeExerciseClone.id = "";
    activeExerciseClone.classList.add("exercise-clone");
    
    exerciseModalTitle.appendChild(activeExerciseClone);

    if(titleStyle) {
        Styles.set(exerciseModalTitle, titleStyle);
        Styles.set(exerciseModalDivider, titleStyle);

        setTimeout(() => {
            Styles.remove(exerciseModalTitle, titleStyle);
            Styles.remove(exerciseModalDivider, titleStyle);
        }, 300);
    }
    
    const exerciseModalContent = document.querySelector("[data-template='exercise-modal-content']").content.firstElementChild.cloneNode(true);
    if(style) Styles.set(exerciseModalContent, style);
    
    appendTo.appendChild(exerciseModalContent);

    const contentP = document.querySelector(".exercise-modal-content .content-p");
    if(contentP !== null) contentP.innerHTML = exercise.tips ? markup(exercise.tips) : "This exercise has no tips.";

    const contentButton = document.querySelector(".exercise-modal-content button");
    
    let isExerciseStarted = false;
    
    contentButton.onclick = startToTask;
    window.eventList.add({ id: "exerciseModalContentKeyDown", type: "keydown", listener: startToTask });

    if(appendTo.scrollHeight < window.innerHeight) exerciseModalContent.id = "extended-exercise-modal-content";
    else exerciseModalContent.id = "";

    return exerciseModalContent;

    function startToTask(e) {
        if(e.key !== "Enter" && e.type === "keydown") return;
        window.eventList.remove("exerciseModalContentKeyDown");
        
        if(isExerciseStarted) return;
        isExerciseStarted = true;
        
        const exerciseModalHeight = parseFloat(getComputedStyle(appendTo).getPropertyValue("height"));
        const buttonAnimation = appendTo.scrollHeight - 10 > realParseInt(appendTo.scrollTop + exerciseModalHeight);

        if(buttonAnimation) contentButton.style.bottom = "-100px";

        setTimeout(() => {
            exerciseModalContent.classList.add("started-exercise-modal-content");
            exerciseModalTitle.classList.add("disabled-exercise-modal-title");

            exerciseModalDivider.style.opacity = "0";
            exerciseModalDivider.style.top = "-10px";

            setTimeout(() => {
                exerciseModalContent.remove();
                exerciseModalTitle.remove();
                exerciseModalDivider.remove();

                Component.create("ExerciseModalTask", { exercise, appendTo });
            }, 300);
        }, buttonAnimation ? 300 : 0);
    }
}
