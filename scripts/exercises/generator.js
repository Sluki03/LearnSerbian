import { exercisesData } from "../../data/exercisesData.js";
import getInteractiveTitle from "../getInteractiveTitle.js";

export default function generator() {
    const tree = document.querySelector(".exercises-tree");
    const treeEnd = document.getElementById("exercises-tree-end");

    exercisesData.forEach((exercise, index) => {
        const exerciseHolder = document.createElement("div");
        exerciseHolder.setAttribute("class", "exercise-holder");
        tree.insertBefore(exerciseHolder, treeEnd);

        const exerciseTitle = document.createElement("div");
        exerciseTitle.setAttribute("class", "exercise-title");
        exerciseHolder.appendChild(exerciseTitle);

        const exerciseDifficulty = document.createElement("div");
        exerciseDifficulty.setAttribute("class", "exercise-difficulty");
        exerciseDifficulty.style.backgroundColor = getDifficultyColor(exercise.difficulty);
        exerciseTitle.appendChild(exerciseDifficulty);

        const exerciseTitleP = document.createElement("p");
        exerciseTitleP.innerText = exercise.name;
        exerciseTitle.appendChild(exerciseTitleP);

        const articleExercise = document.createElement("article");
        articleExercise.setAttribute("class", "exercise");
        exerciseHolder.appendChild(articleExercise);

        const exerciseContent = document.createElement("div");
        exerciseContent.setAttribute("class", "exercise-content");
        articleExercise.appendChild(exerciseContent);

        getInteractiveTitle(index + 1, exerciseContent);
    });

    function getDifficultyColor(difficulty) {
        const colors = { easy: "#0fff03", medium: "#ffe603", hard: "#df1c3d" };
        let selectedColor = "";

        Object.keys(colors).forEach((key, index) => {
            if(key === difficulty) selectedColor = Object.values(colors)[index];
        });

        return selectedColor;
    }
}