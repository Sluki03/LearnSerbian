import { exercisesData } from "../../data/exercises/index.js";
import formatTime from "../functions/calc/formatTime.js";

export default function setExercisesStats() {
    const statsContent = {
        trophy: `0 / ${exercisesData.length}`,
        xp: "0",
        time: "00:00"
    };

    const stats = JSON.parse(localStorage.getItem("exercisesStats"));

    if(stats) {
        const keys = Object.keys(stats);
        statsContent.trophy = `${keys.length} / ${exercisesData.length}`;

        const values = Object.values(stats);
        const total = { xp: 0, time: 0 };

        values.forEach(value => {
            total.xp += value.xp;

            const valueMs = formattedTimeToMs(value.time);
            total.time += valueMs;
        });

        statsContent.xp = total.xp;
        statsContent.time = formatTime(total.time);
    }

    return statsContent;

    function formattedTimeToMs(formattedTime) {
        const [minutes, seconds] = formattedTime.split(":");
        let realSeconds = parseInt(seconds);

        if(parseInt(minutes) > 0) for(let i = 0; i < parseInt(minutes); i++) realSeconds += 60;

        const ms = realSeconds * 1000;
        return ms;
    }
}