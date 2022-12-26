import { Component } from "../components/Component.js";
import { Convert } from "./Convert.js";
import createElement from "./createElement.js";
import updateNotes from "./updateNotes.js";

export const NoteOptions = { create, delete: remove, download, openModal, closeModal };

const body = document.querySelector("body");

function create(e = null) {
    if(e) e.preventDefault();
    
    const submitButton = document.querySelector(".note-modal .classic-button");
    if(submitButton.classList.contains("disabled-classic-button")) return;

    closeModal();

    const fieldsets = document.querySelectorAll("fieldset");
    let noteObject = {};

    fieldsets.forEach((fieldset, index) => {
        const value = fieldset.children[1].value;
        noteObject = {...noteObject, [index ? "content" : "title"]: value};
    });

    const formattedNoteObjectTitle = Convert.cssToJsStandard(noteObject.title.replaceAll(" ", "-"));
    
    const allNotes = JSON.parse(localStorage.getItem("notes"));
    
    if(allNotes === null) localStorage.setItem("notes", JSON.stringify({ [`${formattedNoteObjectTitle}_0`]: noteObject }));

    else {
        const newAllNotes = {...allNotes, [`${formattedNoteObjectTitle}_${Object.keys(allNotes).length}`]: noteObject};
        localStorage.setItem("notes", JSON.stringify(newAllNotes));
    }

    updateNotes();
}

function remove(confirm = false, id) {
    if(!confirm) return Component.create("ClassicModal", {
        text: `Do you really want to delete this note?`,
        buttons: ["no", "yes"],
        buttonsTrigger: { no: "Escape", yes: "Enter" },
        functions: { yes: () => NoteOptions.delete(true, id) },
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
    
    if(existingNoteModal) {
        const existingNoteModalId = existingNoteModal.id.split("-")[0];
        if(existingNoteModalId === id) close();
    }

    updateNotes();
}

function download(id) {
    const checkedNote = document.getElementById(id);

    const allNotes = JSON.parse(localStorage.getItem("notes"));
    let targetNote = {};

    Object.keys(allNotes).forEach((key, index) => {
        if(id === key) targetNote = Object.values(allNotes)[index];
    });

    const a = createElement({
        tag: "a",
        attributes: {
            href: "data:text/plain;charset=utf-8," + encodeURIComponent(targetNote.content),
            download: `${targetNote.title}.txt`
        },
        style: { display: "none" },
        events: [{ on: "click", call: e => e.stopPropagation() }],
        appendTo: checkedNote
    });

    a.click();
    a.remove();
}

function openModal(id = null) {
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
    
function closeModal() {
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