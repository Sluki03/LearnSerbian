import { NoteOptions } from "../../../../functions/notes/NoteOptions.js";
import createElement from "../../../../functions/element/createElement.js";
import updateNotes from "../../../../functions/notes/updateNotes.js";

export default function Notes(componentProps) {
    const { builtIn } = componentProps;
    const { style, appendTo } = componentProps.params;

    const notes = builtIn ? builtIn : createElement({
        tag: "div",
        attributes: { class: "notes" },
        style,
        appendTo
    });

    const notesTitle = createElement({
        tag: "div",
        attributes: { class: "title" },
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

    const exerciseModal = document.querySelector(".exercise-modal");
    
    createElement({
        tag: "img",
        attributes: { src: "./images/icons/plus-icon.png", alt: "ADD", class: "add-note" },
        events: [{ on: "click", call: () => NoteOptions.openModal(null, exerciseModal) }],
        appendTo: notesTitle
    });

    createElement({
        tag: "div",
        attributes: { class: "holder" },
        appendTo: notes
    });

    updateNotes();

    return notes;
}