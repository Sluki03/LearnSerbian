import { NoteModalOptions } from "./NoteModalOptions.js";
import createElement from "./createElement.js";

export default function updateNotes() {
    const notesHolder = document.querySelector(".notes-holder");
    
    const allNotes = JSON.parse(localStorage.getItem("notes"));

    notesHolder.innerHTML = "";
    
    if(allNotes && Object.keys(allNotes).length > 0) Object.keys(allNotes).forEach((key, index) => {
        const note = createElement({
            tag: "div",
            attributes: { class: "note", id: key },
            events: [{ on: "click", call: () => NoteModalOptions.open(key) }],
            appendTo: notesHolder
        });
    
        createElement({
            tag: "img",
            attributes: { src: "./images/icons/notes-icon.png", alt: "NOTE" },
            appendTo: note
        });
    
        createElement({
            tag: "p",
            innerText: Object.values(allNotes)[index].title,
            appendTo: note
        });

        createElement({
            tag: "img",
            attributes: { src: "./images/icons/delete-icon.png", alt: "DELETE", class: "delete-note" },
            events: [{ on: "click", call: e => removeNote(e, key)}],
            appendTo: note
        });
    });

    else createElement({
        tag: "span",
        innerText: "You have no notes.",
        appendTo: notesHolder
    });

    function removeNote(e, key) {
        e.stopPropagation();
        NoteModalOptions.remove(false, key);
    }
}