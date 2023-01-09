import { Component } from "../../Component.js";
import { LessonModalStatus } from "../../../lessons/LessonModalStatus.js";
import { NoteOptions } from "../../../functions/notes/NoteOptions.js";
import createElement from "../../../functions/element/createElement.js";

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
            x: LessonModalStatus.close
        },
        appendTo: lessonModal
    });

    return lessonModal;
}