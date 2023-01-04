import createElement from "../../../functions/element/createElement.js";

export default function StatisticProgressBar(componentProps) {
    const { builtIn } = componentProps;
    const { widths, stats, result, about, appendTo } = componentProps.params;

    const statisticProgressBar = builtIn ? builtIn : createElement({
        tag: "div",
        attributes: { class: "statistic-progress-bar" },
        appendTo
    });

    const progressBar = createElement({
        tag: "div",
        attributes: { class: "progress-bar" },
        appendTo: statisticProgressBar
    });

    createElement({
        tag: "div",
        attributes: { class: "progress-bar-line" },
        style: { width: widths.progressBarLine },
        appendTo: progressBar
    });

    const progressBarStatsHolder = createElement({
        tag: "div",
        attributes: { class: "progress-bar-stats-holder" },
        appendTo: progressBar
    });
    
    stats.forEach((stat, index) => createElement({
        tag: "div",
        attributes: { class: "progress-bar-stat", id: result.id === stat.id ? "active-progress-bar-stat" : "" },
        style: { width: widths.progressBarStats[index] },
        appendTo: progressBarStatsHolder
    }));

    if(about) createElement({
        tag: "p",
        innerText: about,
        appendTo: statisticProgressBar
    });

    return statisticProgressBar;
}