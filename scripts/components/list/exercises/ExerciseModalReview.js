import { Component } from "../../Component.js";
import createElement from "../../../functions/createElement.js";
import review from "../../../exercises/review/index.js";

export default function ExerciseModalReview(componentProps) {
    const { exercise, results, score, appendTo } = componentProps.params;
    
    const exerciseModalReview = document.querySelector("[data-template='exercise-modal-review']").content.firstElementChild.cloneNode(true);
    appendTo.appendChild(exerciseModalReview);

    setTimeout(() => { exerciseModalReview.classList.add("active-exercise-modal-review") }, 100);

    const reviewHolder = document.querySelector(".exercise-modal-review .review-holder");

    results.forEach(result => {
        const reviewTask = document.querySelector("[data-template='exercise-modal-review-task']").content.firstElementChild.cloneNode(true);
        reviewHolder.appendChild(reviewTask);

        const [reviewTaskHolder, taskViewMore] = [...reviewTask.children];
        const [reviewTaskInfo] = [...reviewTaskHolder.children];

        const green = { normal: "#059c20", light: "#07db2d", lighter: "#00ff2e" };
        const red = { normal: "#bd1330", light: "#d91435", lighter: "#f20707" };

        const validColor = result.isCorrect ? green : red;
        const { normal, light, lighter } = validColor;

        const linearGradient = `linear-gradient(135deg, ${normal} 65%, ${light} 65% 85%, ${lighter} 85%)`;
        reviewTask.style.background = linearGradient;

        const validImage = result.isCorrect ? "./images/icons/circle-check.svg" : "./images/icons/circle-x.svg";

        createElement({
            tag: "img",
            attributes: { src: validImage, alt: result.isCorrect ? "CORRECT" : "INCORRECT" },
            appendTo: reviewTaskHolder,
            before: reviewTaskInfo
        });
        
        const [infoStrong] = [...reviewTaskInfo.children]; 

        infoStrong.innerText = result.title;

        Component.render(taskViewMore);

        const [viewMoreTitle] = [...taskViewMore.children];
        const [titleButton, viewMoreP] = [...viewMoreTitle.children];

        viewMoreTitle.id = result.id;

        viewMoreTitle.onclick = () => {
            const titleButtonTransform = getComputedStyle(titleButton).getPropertyValue("transform");
            
            const activeTaskViewMore = document.getElementById("active-task-view-more");
            const activeViewMoreTitle = activeTaskViewMore ? activeTaskViewMore.children[0] : null;
            
            if(activeTaskViewMore && (activeViewMoreTitle.id !== viewMoreTitle.id)) closeViewMore(true);
            else if(titleButtonTransform !== "none" && (activeViewMoreTitle.id === viewMoreTitle.id)) closeViewMore();
            else openViewMore();
            
            function openViewMore() {
                taskViewMore.id = "active-task-view-more";

                titleButton.style.transform = "rotate(180deg)";
                viewMoreP.innerText = "view less";

                const current = {
                    task: null,
                    result: null
                };

                exercise.tasks.forEach(task => {
                    if(viewMoreTitle.id === task.id) current.task = task;
                });
                
                results.forEach(result => {
                    if(viewMoreTitle.id === result.id) current.result = result;
                });

                review(results, current);
            }

            function closeViewMore(openNew = false) {
                const validViewMoreTitle = openNew ? activeViewMoreTitle : viewMoreTitle;
                const [validTitleButton, validViewMoreP] = [...validViewMoreTitle.children];

                activeTaskViewMore.id = "";
                activeTaskViewMore.style.height = "";

                validTitleButton.style.transform = "";
                validViewMoreP.innerText = "view more";

                setTimeout(() => {
                    const activeTaskReview = activeTaskViewMore.children[1];
                    activeTaskReview.remove();

                    if(openNew) openViewMore();
                }, 300);
            }
        }
    });

    const continueButton = document.querySelector(".exercise-modal-review .wide-button");
    continueButton.onclick = modalOptionsReturn;
    let inProgress = false;

    window.eventList.add({ id: "exerciseModalReviewKeyDown", type: "keydown", listener: modalOptionsReturn });
    
    function modalOptionsReturn(e) {
        if(e.type === "keydown" && e.key !== "Enter") return;

        if(inProgress) return;
        inProgress = true;
        
        window.eventList.remove("exerciseModalReviewKeyDown");
        
        exerciseModalReview.classList.remove("active-exercise-modal-review");

        setTimeout(() => {
            exerciseModalReview.remove();
            Component.create("ExerciseModalFinished", { exercise, results, score, appendTo });
            inProgress = false;
        }, 300);
    }

    return exerciseModalReview;
}