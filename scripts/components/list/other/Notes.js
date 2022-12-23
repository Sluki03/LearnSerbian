import { Component } from "../../Component.js";
import createElement from "../../../functions/createElement.js";

export default function Notes(componentProps) {
    const { builtIn } = componentProps;
    const { appendTo } = componentProps.params;

    const notes = builtIn ? builtIn : createElement({
        tag: "div",
        attributes: { class: "notes" },
        appendTo
    });

    const notesTitle = createElement({
        tag: "div",
        attributes: { class: "notes-title" },
        appendTo: notes
    });

    createElement({
        tag: "img",
        attributes: { src: "./images/icons/notes-icon.png", alt: "NOTES" },
        appendTo: notesTitle
    });

    createElement({
        tag: "strong",
        innerText: "notes",
        appendTo: notesTitle
    });

    const notesHolder = createElement({
        tag: "div",
        attributes: { class: "notes-holder" },
        appendTo: notes
    });

    const allNotes = JSON.parse(localStorage.getItem("notes"));

    if(!allNotes || Object.keys(allNotes).length === 0) {
        const noNotes = createElement({
            tag: "div",
            attributes: { class: "no-notes" },
            events: [{ on: "click", call: createNote }],
            appendTo: notesHolder
        });

        createElement({
            tag: "img",
            attributes: { src: "./images/icons/plus-icon.png", alt: "PLUS" },
            appendTo: noNotes
        });

        createElement({
            tag: "p",
            innerText: "Add note",
            appendTo: noNotes
        });
    }

    return notes;

    function createNote() {
        const body = document.querySelector("body");

        const createNoteModal = createElement({
            tag: "div",
            attributes: { class: "create-note" },
            appendTo: body
        });

        setTimeout(() => createNoteModal.classList.add("active-create-note"), 100);

        Component.create("ModalOptions", {
            functions: { x: closeCreateNoteModal },
            appendTo: createNoteModal
        });
        
        createElement({
            tag: "h3",
            innerText: "create note",
            appendTo: createNoteModal
        });

        function closeCreateNoteModal() {
            createNoteModal.style.opacity = "0";
            createNoteModal.style.top = "60%";

            setTimeout(() => createNoteModal.remove(), 300);
        }
    }
}