import { Component } from "../../Component.js";
import createElement from "../../../functions/createElement.js";
import updateNotes from "../../../functions/updateNotes.js";

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

    const addNoteButton = createElement({
        tag: "button",
        attributes: { class: "note" },
        events: [{ on: "click", call: addNote }],
        appendTo: notesHolder
    });

    createElement({
        tag: "img",
        attributes: { src: "./images/icons/plus-icon.png", alt: "PLUS" },
        appendTo: addNoteButton
    });

    createElement({
        tag: "p",
        innerText: "Add note",
        appendTo: addNoteButton
    });

    updateNotes();

    Component.create("Scrollbar", { trigger: notesHolder, appendTo: notes });

    return notes;

    function addNote() {
        const existingNoteModal = document.querySelector(".note-modal");
        if(existingNoteModal) return;

        const body = document.querySelector("body");
        Component.create("NoteModal", { type: "add", appendTo: body });
    }
}