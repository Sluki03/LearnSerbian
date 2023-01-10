import { Component } from "../../components/Component.js";
import { NoteOptions } from "./NoteOptions.js";
import createElement from "../element/createElement.js";

export default function updateNotes() {
    const notes = document.querySelector(".notes");
    const allNotesHolders = document.querySelectorAll(".notes .holder");
    
    const allNotes = JSON.parse(localStorage.getItem("notes"));

    allNotesHolders.forEach(notesHolder => {
        notesHolder.innerHTML = "";

        if(allNotes && Object.keys(allNotes).length > 0) {
            Object.keys(allNotes).forEach((key, index) => {
                const note = createElement({
                    tag: "div",
                    attributes: { class: "note", id: key },
                    events: [{ on: "click", call: () => NoteOptions.openModal(key) }],
                    appendTo: notesHolder
                });
            
                createElement({
                    tag: "img",
                    attributes: { src: Object.values(allNotes)[index].icon, alt: "NOTE" },
                    appendTo: note
                });
            
                createElement({
                    tag: "p",
                    innerText: Object.values(allNotes)[index].title,
                    appendTo: note
                });
        
                createElement({
                    tag: "div",
                    attributes: { class: "note-check" },
                    events: [{ on: "click", call: e => checkNote(e, key) }],
                    appendTo: note
                });
            });
    
            Component.create("Scrollbar", { trigger: notesHolder, appendTo: notesHolder });
        }
    
        else createElement({
            tag: "span",
            innerText: "You have no notes.",
            appendTo: notesHolder
        });
    });

    function checkNote(e, id) {
        e.stopPropagation();
        
        const targetNote = document.getElementById(id);
        const targetNoteCheck = targetNote.querySelector(".note-check");

        const notesDashboard = notes.querySelector(".notes-dashboard");

        if(targetNote.classList.contains("checked-note")) {
            targetNote.classList.remove("checked-note");
            targetNoteCheck.classList.remove("active-note-check");
            
            const targetNoteImg = targetNoteCheck.children[0];
            targetNoteImg.classList.remove("active-note-check-img");

            setTimeout(() => targetNoteImg.remove(), 150);

            const checkedNotes = notes.querySelectorAll(".checked-note");
            
            if(checkedNotes.length === 0) {
                notesDashboard.style.height = "";
                setTimeout(() => notesDashboard.remove(), 300);
            }
        }

        else {
            targetNote.classList.add("checked-note");
            targetNoteCheck.classList.add("active-note-check");

            const targetNoteImg = createElement({
                tag: "img",
                attributes: { src: "./images/icons/check-icon.png", alt: "CHECK" },
                appendTo: targetNoteCheck
            });

            setTimeout(() => targetNoteImg.classList.add("active-note-check-img"), 100);

            if(!notesDashboard) Component.create("NotesDashboard", { appendTo: notes });
        }
    }
}