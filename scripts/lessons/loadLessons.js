import { lessonsData } from "../../data/lessons/index.js";
import { Component } from "../components/Component.js";
import { Convert } from "../functions/text/Convert.js";
import { LessonModalStatus } from "./LessonModalStatus.js";
import createElement from "../functions/element/createElement.js";

export default function loadLessons() {
    const lessonsList = document.querySelector(".lessons-list");
    
    lessonsData.forEach((lesson, index) => {
        const lessonElement = createElement({
            tag: "div",
            attributes: { class: "lesson", id: `${Convert.cssToJsStandard(lesson.name.replaceAll(" ", "-"))}_${index}` },
            events: [{ on: "click", call: LessonModalStatus.open }],
            appendTo: lessonsList
        });
    
        if(lesson.icon) createElement({
            tag: "img",
            attributes: { src: lesson.icon, alt: lesson.name },
            appendTo: lessonElement
        });

        else Component.create("InteractiveTitle", { title: index + 1, appendTo: lessonElement });

        const lessonTitle = createElement({
            tag: "div",
            attributes: { class: "lesson-title" },
            appendTo: lessonElement
        });

        createElement({
            tag: "strong",
            innerText: lesson.name,
            appendTo: lessonTitle
        });

        createElement({
            tag: "p",
            innerText: lesson.description,
            appendTo: lessonTitle
        });

        if(lesson.keywords) {
            const keywordHolder = createElement({
                tag: "div",
                attributes: { class: "keyword-holder" },
                appendTo: lessonTitle
            });
    
            lesson.keywords.forEach(keyword => {
                const keywordScheme = {
                    tag: "p",
                    innerText: keyword,
                    appendTo: keywordHolder
                };
                
                if(typeof keyword === "string") createElement(keywordScheme);
                else createElement({...keywordScheme,  innerText: keyword.text, style: { background: keyword.color } });
            });
        }
    });
}