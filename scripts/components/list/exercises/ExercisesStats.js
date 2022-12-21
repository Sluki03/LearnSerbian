import createElement from "../../../functions/createElement.js";
import setExercisesStats from "../../../exercises/setExercisesStats.js";

export default function ExercisesStats(componentProps) {
    const { builtIn } = componentProps;
    const { appendTo } = componentProps.params;

    const exercisesStats = builtIn ? builtIn : createElement({
        tag: "div",
        attributes: { class: "exercises-stats" },
        appendTo
    });

    const statsTitle = createElement({
        tag: "div",
        attributes: { class: "stats-title" },
        appendTo: exercisesStats
    });

    createElement({
        tag: "img",
        attributes: { src: "./images/icons/about-icon.png", alt: "STATISTICS" },
        appendTo: statsTitle
    });

    createElement({
        tag: "strong",
        innerText: "statistics",
        appendTo: statsTitle
    });

    const statsContent = setExercisesStats();

    const statsIcons = [
        "./images/icons/trophy-icon.png",
        "./images/icons/score-icon-grey.png",
        "./images/icons/time-icon-grey.png"
    ];

    const statsHolder = createElement({
        tag: "div",
        attributes: { class: "stats-holder" },
        appendTo: exercisesStats
    });

    Object.keys(statsContent).forEach((key, index) => {
        const stat = createElement({
            tag: "div",
            attributes: { class: "stat" },
            appendTo: statsHolder
        });

        createElement({
            tag: "img",
            attributes: { src: statsIcons[index], alt: key.toUpperCase() },
            appendTo: stat
        });

        createElement({
            tag: "p",
            innerText: Object.values(statsContent)[index],
            appendTo: stat
        });
    });

    return exercisesStats;
}