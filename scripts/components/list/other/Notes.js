import { NoteOptions } from "../../../functions/NoteOptions.js";
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

    createElement({
        tag: "img",
        attributes: { src: "./images/icons/plus-icon.png", alt: "ADD", class: "add-note" },
        events: [{ on: "click", call: () => NoteOptions.openModal() }],
        appendTo: notesTitle        
    });

    createElement({
        tag: "div",
        attributes: { class: "notes-holder" },
        appendTo: notes
    });

    updateNotes();

    return notes;
}