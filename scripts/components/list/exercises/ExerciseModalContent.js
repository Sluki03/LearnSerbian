import { Component } from "../../Component.js";
import createElement from "../../../functions/createElement.js";
import getDifficultyColor from "../../../exercises/getDifficultyColor.js";
import markup from "../../../functions/markup.js";
import setStyles from "../../../functions/setStyles.js";
import realParseInt from "../../../functions/realParseInt.js";

export default function ExerciseModalContent(componentProps) {
    const { exercise, appendTo, style } = componentProps.params;
    
    const exerciseModalContent = document.querySelector("[data-template='exercise-modal-content']").content.firstElementChild.cloneNode(true);
    if(style !== undefined) setStyles(exerciseModalContent, style);
    
    appendTo.appendChild(exerciseModalContent);
    
    const contentDifficultyCircles = document.querySelector(".content-difficulty-circles");

    for(let i = 0; i < getDifficultyIndex(); i++) createElement({
        tag: "div",
        attributes: { class: "content-difficulty-circle" },
        style: { backgroundColor: getDifficultyColor(exercise.difficulty) },
        appendTo: contentDifficultyCircles
    });

    const contentP = document.querySelector(".exercise-modal-content .content-p");
    contentP.innerHTML = exercise.tips ? markup(exercise.tips) : "This exercise has no tips.";

    const contentButton = document.querySelector(".exercise-modal-content button");

    const exerciseModalTitle = document.querySelector(".exercise-modal-title");
    const exerciseModalDivider = document.querySelector(".divider");
    
    let isExerciseStarted = false;
    
    contentButton.onclick = () => {
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

    if(appendTo.scrollHeight < window.innerHeight) exerciseModalContent.id = "extended-exercise-modal-content";
    else exerciseModalContent.id = "";

    return exerciseModalContent;

    function getDifficultyIndex() {
        const difficultyRow = ["easy", "medium", "hard"];
        
        let index;
        for(let i = 0; i < difficultyRow.length; i++) if(exercise.difficulty === difficultyRow[i]) index = i;

        return index + 1;
    }
}
