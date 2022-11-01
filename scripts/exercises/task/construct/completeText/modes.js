import { Inputs, Spans } from "./functions.js";

export default function modes(thisTask) {
    if(thisTask.currentTask.mode.type === "write") {
        thisTask.currentTask.mode.type = "wordBank";
        if(thisTask.currentTask.hints.status) Spans.set(thisTask);
    }

    else {
        thisTask.currentTask.mode.type = "write";
        if(thisTask.currentTask.hints.status) Inputs.set(thisTask);

        const wordBank = document.querySelector(".complete-text-word-bank");
        wordBank.remove();
    }
}