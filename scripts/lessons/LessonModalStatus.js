import { Component } from "../components/Component.js";

export const LessonModalStatus = { open, close };

let activeLessonId = -1;

const body = document.querySelector("body");
const nav = document.querySelector("nav");
const scrollbar = document.querySelector("body .scrollbar");

function open(lesson, id) {
    if(activeLessonId === id) return;
    if(activeLessonId !== -1) close();
    
    else {
        body.style.overflow = "hidden";

        nav.style.opacity = "0";
        nav.style.top = "-65px";

        scrollbar.style.transition = "500ms";
        scrollbar.style.opacity = "0";
        scrollbar.style.right = "-10px";

        setTimeout(() => { scrollbar.style.display = "none" }, 500);
        Component.create("LessonModal", { lesson, appendTo: body });
    }

    activeLessonId = id;
}

function close() {
    nav.style.opacity = "";
    nav.style.top = "";

    const lessonModal = document.querySelector(".lesson-modal");
    lessonModal.id = "";

    setTimeout(() => {        
        body.style.overflow = "";
        scrollbar.style.display = "";

        setTimeout(() => {
            scrollbar.style.opacity = "";
            scrollbar.style.right = "";
            
            setTimeout(() => { scrollbar.style.transition = "" }, 500);
        }, 100);

        lessonModal.remove();
        activeLessonId = -1;
    }, 300);
}