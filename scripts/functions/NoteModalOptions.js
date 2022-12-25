import { Component } from "../components/Component.js";
import updateNotes from "./updateNotes.js";

export const NoteModalOptions = { open, close, remove };

const body = document.querySelector("body");

function open(id = null) {
    const existingNoteModal = document.querySelector(".note-modal");

    if(existingNoteModal) {
        const noteModalId = existingNoteModal.id.split("-")[0];
        if(noteModalId === id) return;

        close();
        return setTimeout(() => open(id), 300);
    }

    const targetNote = getTargetNote(id);    

    Component.create("NoteModal", {
        type: id ? "view" : "add",
        targetNote: id ? targetNote : null,
        appendTo: body
    });

    function getTargetNote(id = null) {
        if(!id) return id;
        
        const allNotes = JSON.parse(localStorage.getItem("notes"));
        let targetNote = { id };
    
        Object.keys(allNotes).forEach((key, index) => {
            if(id === key) targetNote = {...targetNote, ...Object.values(allNotes)[index]};
        });
    
        return targetNote;
    }
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

function remove(confirm = false, id) {
    if(!confirm) return Component.create("ClassicModal", {
        text: "Do you really want to delete this note?",
        buttons: ["no", "yes"],
        buttonsTrigger: { no: "Escape", yes: "Enter" },
        functions: { yes: () => NoteModalOptions.remove(true, id) },
        appendTo: body
    });
    
    const allNotes = JSON.parse(localStorage.getItem("notes"));
    let newAllNotes = {};

    Object.keys(allNotes).forEach((key, index) => {
        if(id === key) return;
        newAllNotes = {...newAllNotes, [key]: Object.values(allNotes)[index]};
    });

    localStorage.setItem("notes", JSON.stringify(newAllNotes));

    const existingNoteModal = document.querySelector(".note-modal");
    const existingNoteModalId = existingNoteModal.id.split("-")[0];

    if(existingNoteModalId === id) close();

    updateNotes();
}