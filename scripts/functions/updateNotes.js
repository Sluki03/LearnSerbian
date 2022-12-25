import createElement from "./createElement.js";
import { NoteModalOptions } from "./NoteModalOptions.js";

export default function updateNotes() {
    const notesHolder = document.querySelector(".notes-holder");
    const allNotes = JSON.parse(localStorage.getItem("notes"));
    
    if(allNotes && Object.keys(allNotes).length > 0) {
        const span = document.querySelector(".notes-holder span");
        if(span) span.remove();
        
        Object.keys(allNotes).forEach((key, index) => {
            const existingNote = document.getElementById(key);
            if(existingNote) return;
            
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
        });
    }

    else createElement({
        tag: "span",
        innerText: "You have no notes.",
        appendTo: notesHolder
    });
}