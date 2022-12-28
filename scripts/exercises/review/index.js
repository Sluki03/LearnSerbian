import { Convert } from "../../functions/Convert.js";
import createElement from "../../functions/createElement.js";
import { TransitionDimensions } from "../../functions/TransitionDimensions.js";

import multipleChoice from "./construct/multipleChoice.js";
import translate from "./construct/translate.js";
import conversation from "./construct/conversation.js";
import connect from "./construct/connect.js";
import completeText from "./construct/completeText.js";
import listen from "./construct/listen.js";

import answer from "./stats/answer.js";
import xp from "./stats/xp.js";
import time from "./stats/time.js";
import mode from "./stats/mode.js";
import explanation from "./stats/explanation.js";

export default function review(results, current) {
    const taskViewMore = document.getElementById("active-task-view-more");

    const taskReview = createElement({
        tag: "div",
        attributes: { class: "task-review" },
        appendTo: taskViewMore
    });

    createElement({
        tag: "span",
        attributes: { class: "mini-title" },
        innerText: `- ${typeToTitle()}:`,
        appendTo: taskReview
    });
    
    createElement({
        tag: "strong",
        innerText: current.task.title,
        appendTo: taskReview
    });

    taskReview.classList.add(`${Convert.jsToCssStandard(current.task.type)}-review`);

    const reviewTasks = {
        multipleChoice, multipleChoiceOfImage: multipleChoice, multipleChoiceImages: multipleChoice, translate, conversation,
        connect, completeText, listen
    };

    let constructReview;

    Object.keys(reviewTasks).forEach((key, index) => {
        if(current.task.type === key) constructReview = Object.values(reviewTasks)[index];
    });

    constructReview({ current, taskReview });

    const stats = { answer, xp, time, mode, explanation };
    Object.values(stats).forEach(value => value({ results, current, taskReview }));

    TransitionDimensions.height(taskViewMore);

    function typeToTitle() {
        const titles = {
            multipleChoice: "Multiple Choice",
            multipleChoiceOfImage: "Multiple Choice of Image",
            multipleChoiceImages: "Multiple Choice with Images",
            translate: "Translate",
            conversation: "Conversation",
            connect: "Connect",
            completeText: "Complete the Text",
            listen: "Listen"
        };

        let result = "";

        Object.keys(titles).forEach((title, index) => {
            if(current.task.type === title) result = Object.values(titles)[index];
        });

        return result;
    }
}