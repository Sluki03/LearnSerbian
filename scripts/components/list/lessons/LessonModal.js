import { Component } from "../../Component.js";
import { LessonModalStatus } from "../../../lessons/LessonModalStatus.js";
import { NoteOptions } from "../../../functions/notes/NoteOptions.js";
import createElement from "../../../functions/element/createElement.js";
import markdown from "../../../functions/text/markdown.js";

export default function LessonModal(componentProps) {
    const { builtIn } = componentProps;
    const { lesson, appendTo } = componentProps.params;

    const main = document.querySelector("main");

    const lessonModal = builtIn ? builtIn : createElement({
        tag: "div",
        attributes: { class: "lesson-modal" },
        appendTo,
        before: main
    });

    setTimeout(() => lessonModal.setAttribute("id", "active-lesson-modal"), 100);

    Component.create("ModalOptions", {
        functions: {
            notes: () => NoteOptions.openInModal("lesson"),
            x: closeLessonModal
        },
        appendTo: lessonModal
    });

    const lessonTime = document.querySelector("[data-template='lesson-time']").content.firstElementChild.cloneNode(true);
    lessonModal.appendChild(lessonTime);

    const lessonTimeP = [...lessonTime.children][1];

    let interval = null;
    startCounter();

    const lessonTitle = document.querySelector("[data-template='lesson-title']").content.firstElementChild.cloneNode(true);
    lessonModal.appendChild(lessonTitle);

    const [lessonTitleImg, lessonTitleH2] = [...lessonTitle.children];

    if(lesson.icon) {
        lessonTitleImg.src = lesson.icon;
        lessonTitleImg.alt = lesson.name;
    }

    else {
        lessonTitleImg.remove();

        const id = document.querySelector(".active-lesson").id;
        const order = parseInt(id.split("_")[1]);

        Component.create("InteractiveTitle", { title: order + 1, appendTo: lessonTitle, before: lessonTitleH2 });
    }

    lessonTitleH2.innerText = lesson.name;

    createElement({
        tag: "p",
        attributes: { class: "lesson-content" },
        innerHTML: markdown(lesson.content),
        appendTo: lessonModal
    });

    return lessonModal;

    function closeLessonModal() {
        clearInterval(interval);
        interval = null;

        LessonModalStatus.close();
    }
    
    function startCounter() {
        interval = setInterval(() => {
            const [minutes, seconds] = lessonTimeP.innerText.split(":");
            
            if(parseInt(seconds) === 59) {
                const nextMinute = parseInt(minutes) + 1;
                lessonTimeP.innerText = `${nextMinute >= 10 ? nextMinute : `0${nextMinute}`}:00`;
            }

            else {
                const nextSecond = parseInt(seconds) + 1;
                lessonTimeP.innerText = `${minutes}:${nextSecond >= 10 ? nextSecond : `0${nextSecond}`}`;
            }
        }, 1000);
    }
}