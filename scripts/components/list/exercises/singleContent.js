import createElement from "../../../functions/createElement.js";
import getDifficultyColor from "../../../exercises/getDifficultyColor.js";
import markup from "../../../functions/markup.js";

export default function SingleContent(componentProps) {
    const [exercise, exerciseModal] = componentProps.params;
    
    const exerciseModalContent = document.querySelector("[data-template='exercise-modal-content']").content.firstElementChild.cloneNode(true);
    exerciseModal.appendChild(exerciseModalContent);
    
    const contentDifficultyCircles = document.querySelector(".content-difficulty-circles");

    for(let i = 0; i < getDifficultyIndex(); i++) createElement({
        tag: "div",
        attributes: { class: "content-difficulty-circle" },
        style: { backgroundColor: getDifficultyColor(exercise.difficulty) },
        appendTo: contentDifficultyCircles
    });

    const contentP = document.querySelector(".exercise-modal-content .content-p");
    contentP.innerHTML = exercise.tips ? markup(exercise.tips) : "This exercise has no tips.";

    if(exerciseModal.scrollHeight < window.innerHeight) exerciseModalContent.id = "extended-exercise-modal-content";
    else exerciseModalContent.id = "";

    return exerciseModalContent;

    function getDifficultyIndex() {
        const difficultyRow = ["easy", "medium", "hard"];
        
        let index;
        for(let i = 0; i < difficultyRow.length; i++) if(exercise.difficulty === difficultyRow[i]) index = i;

        return index + 1;
    }
}