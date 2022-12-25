import { Component } from "../components/Component.js";

export const NoteModalOptions = { open, close };

function open(id = null) {
    const existingNoteModal = document.querySelector(".note-modal");

    if(existingNoteModal) {
        const noteModalId = existingNoteModal.id.split("-")[0];
        if(noteModalId === id) return;

        close();
        return setTimeout(() => open(id), 300);
    }
    
    const body = document.querySelector("body");

    const allNotes = JSON.parse(localStorage.getItem("notes"));
    let targetNote = { id };

    Object.keys(allNotes).forEach((key, index) => {
        if(id === key) targetNote = {...targetNote, ...Object.values(allNotes)[index]};
    });

    Component.create("NoteModal", {
        type: id ? "view" : "add",
        targetNote: id ? targetNote : null,
        appendTo: body
    });
}

let inProgress = false;
    
function close() {
    if(inProgress) return;
    inProgress = true;

    const noteModal = document.querySelector(".note-modal");
    if(noteModal === null) return inProgress = false;

    noteModal.style.opacity = "0";
    noteModal.style.top = "60%";
    
    window.eventList.remove("notesKeyDown");

    setTimeout(() => {
        noteModal.remove();
        inProgress = false;
    }, 300);
}