import createElement from "../../../functions/createElement.js";

export default function ExerciseStats(componentProps) {
    const { builtIn } = componentProps;
    const { score, appendTo } = componentProps.params;

    const exerciseStats = builtIn ? builtIn : createElement({
        tag: "div",
        attributes: { class: "exercise-stats" },
        appendTo
    });

    const trophyHolder = createElement({ tag: "div", attributes: { class: "trophy-holder" }, appendTo: exerciseStats });
    
    createElement({
        tag: "img",
        attributes: { src: "./images/icons/trophy-icon.png", alt: "TROPHY" },
        appendTo: trophyHolder
    });

    const statsHolder = createElement({
        tag: "div",
        attributes: { class: "stats-holder" },
        appendTo: exerciseStats
    });

    const stats = ["./images/icons/score-icon-grey.png", "./images/icons/time-icon-grey.png"];

    stats.forEach((stat, index) => {
        const statElement = createElement({
            tag: "div",
            attributes: { class: "stat" },
            appendTo: statsHolder
        });

        createElement({
            tag: "img",
            attributes: { src: stat, alt: index ? "TIME" : "SCORE" },
            appendTo: statElement
        });

        createElement({
            tag: "p",
            innerText: index ? score.xp : score.time,
            appendTo: statElement
        });
    });

    return exerciseStats;
}