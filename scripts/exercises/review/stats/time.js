import { Component } from "../../../components/Component.js";
import { Percentage } from "../../../functions/Percentage.js";
import createElement from "../../../functions/createElement.js";
import formatTime from "../../../functions/formatTime.js";

export default function time(reviewProps) {
    const { results, current, taskReview } = reviewProps;
    const { result } = current;
    
    const timeInfo = createElement({
        tag: "div",
        attributes: { class: "time-info" },
        appendTo: taskReview
    });

    createElement({
        tag: "strong",
        innerText: "Time",
        appendTo: timeInfo
    });

    let taskOrder = -1;
    
    const timeProps = {
        total: 0,
        next: 0,
        row: []
    };

    results.forEach((r, index) => {
        if((taskOrder === -1) && (result.id === r.id)) taskOrder = index;
    });
    
    if(taskOrder === results.length - 1) timeProps.next = result.endTime;
    else timeProps.next = results[taskOrder + 1].startTime;

    results.forEach((r, index) => {
        let nextTaskTime = 0;

        if(index === results.length - 1) nextTaskTime = r.endTime;
        else nextTaskTime = results[index + 1].startTime;

        const taskDuration = nextTaskTime - r.startTime;
        
        timeProps.row.push({ id: r.id, time: calcRealSeconds(taskDuration) });
    });

    timeProps.row.forEach(timeProp => timeProps.total += timeProp.time);

    const progressBarStats = [];

    timeProps.row.forEach(timeProp => progressBarStats.push(`${Percentage.calc(timeProps.total, timeProp.time)}%`));
    
    Component.create("StatisticProgressBar", {
        widths: {
            progressBarLine: "100%",
            progressBarStats
        },
        stats: timeProps.row,
        result,
        about: `+${formatTime(timeProps.next - result.startTime)}`,
        appendTo: timeInfo
    });

    const progressBarAbout = createElement({
        tag: "div",
        attributes: { class: "progress-bar-about" },
        appendTo: timeInfo
    });

    const aboutProps = [
        {
            color: "white",
            text: "Total time"
        },

        {
            color: "#0559f5",
            text: "Task time"
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

    const timeInfoText = `
        The time it took you to complete this task is <span>${formatTime(timeProps.next - result.startTime)}</span>.<br>
        The duration of this task contributed <span>${parseInt(Percentage.calc(timeProps.total, timeProps.row[taskOrder].time))}%</span> to the total time (<span>${formatTime(results[results.length - 1].endTime - results[0].startTime)}</span>).
    `;
    
    createElement({
        tag: "p",
        attributes: { class: "info-text" },
        innerHTML: timeInfoText,
        appendTo: timeInfo
    });

    function calcRealSeconds(ms) {
        const formatted = formatTime(ms);
        const seconds = formattedTimeToSeconds();

        return seconds;

        function formattedTimeToSeconds() {
            const [minutes, seconds] = formatted.split(":");
            
            const formattedTime = {
                minutes: parseInt(minutes),
                seconds: parseInt(seconds)
            };

            let realSeconds = formattedTime.seconds;
            for(let i = 0; i < formattedTime.minutes; i++) realSeconds += 60;

            return realSeconds;
        }
    }
}