import { Component } from "../../../components/Component.js";
import { Percentage } from "../../../functions/Percentage.js";
import createElement from "../../../functions/createElement.js";

export default function xp(reviewProps) {
    const { results, current, taskReview } = reviewProps;
    const { task, result } = current;
    
    const xpInfo = createElement({
        tag: "div",
        attributes: { class: "xp-info" },
        appendTo: taskReview
    });

    createElement({
        tag: "strong",
        innerText: "Experience",
        appendTo: xpInfo
    });

    let taskOrder = -1;
    
    const xpProps = {
        total: 0,
        user: 0,
        task: task.xp || 10,
        row: []
    };

    for(let i = 0; i < 2; i++) {
        const blockIncorrectResult = i > 0;
        let xpCollector = 0;
        
        results.forEach((r, index) => {
            if((taskOrder === -1) && result.id === r.id) taskOrder = index;
            
            if(blockIncorrectResult && !r.isCorrect) return;
        
            if(r.xp) xpCollector += r.xp;
            else xpCollector += 10;

            if(i) xpProps.user = xpCollector;
            else xpProps.total = xpCollector;
        });
    }

    const answers = { correct: [], incorrect: [] };

    results.forEach(r => {
        const xp = r.xp || 10;

        if(r.isCorrect) answers.correct.push({ id: r.id, xp });
        else answers.incorrect.push({ id: r.id, xp });
    });

    xpProps.row = [...answers.correct, ...answers.incorrect];

    const progressBarStats = [];

    xpProps.row.forEach(xpProp => {
        const width = `${Percentage.calc(xpProps.total, xpProp.xp)}%`;
        progressBarStats.push(width);
    });
    
    Component.create("StatisticProgressBar", {
        widths: {
            progressBarLine: `${Percentage.calc(xpProps.total, xpProps.user)}%`,
            progressBarStats
        },
        stats: xpProps.row,
        result,
        about: `${result.isCorrect ? "+" : ""}${xpProps.task} XP`,
        appendTo: xpInfo
    });

    const progressBarAbout = createElement({
        tag: "div",
        attributes: { class: "progress-bar-about" },
        appendTo: xpInfo
    });

    const aboutProps = [
        {
            color: "white",
            text: "Total XP"
        },
        
        {
            color: "#0559f5",
            text: "Total Earned XP"
        },

        {
            color: "#d91435",
            text: "Task XP"
        }
    ];

    aboutProps.forEach(aboutProp => {
        const singleProgressBarAbout = createElement({
            tag: "div",
            attributes: { class: "single-progress-bar-about" },
            appendTo: progressBarAbout
        });

        createElement({
            tag: "div",
            attributes: { class: "about-circle" },
            style: { backgroundColor: aboutProp.color },
            appendTo: singleProgressBarAbout
        });

        createElement({
            tag: "p",
            innerText: aboutProp.text,
            appendTo: singleProgressBarAbout
        });
    });

    const xpInfoText = result.isCorrect
        ? `
            You answered this task <span>correctly</span> and received <span>${xpProps.task} XP</span>!<br>
            This task contributed <span>${parseInt(Percentage.calc(xpProps.user, xpProps.task))}%</span> to your total score (<span>${xpProps.user} / ${xpProps.total} XP</span>).
        `
    : `
        You answered this task <span>incorrectly</span> and did not get <span>${xpProps.task} XP</span>.<br>
        This task contributes <span>${parseInt(Percentage.calc(xpProps.total, xpProps.task))}%</span> to the total score you can get (<span>${xpProps.total} XP</span>).
    `;
    
    createElement({
        tag: "p",
        attributes: { class: "info-text" },
        innerHTML: xpInfoText,
        appendTo: xpInfo
    });
}