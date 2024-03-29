import { Component } from "../../components/Component.js";
import { Convert } from "../text/Convert.js";
import { TransitionDimensions } from "../element/TransitionDimensions.js";
import createElement from "../element/createElement.js";
import updateNotes from "./updateNotes.js";
import getPath from "../other/getPath.js";

export const NoteOptions = {
    create, edit, delete: remove, download, openModal,
    closeModal, openOptionsModal, closeOptionsModal, openInModal, closeInModal
};

const body = document.querySelector("body");
const path = getPath();

function create(e = null) {
    if(e) e.preventDefault();
    
    const submitButton = document.querySelector(".note-modal .classic-button");
    if(submitButton.classList.contains("disabled-classic-button")) return;

    window.eventList.remove("notesKeyDown");

    closeModal();

    const noteObject = getFormData();
    const formattedNoteObjectTitle = Convert.cssToJsStandard(noteObject.title.replaceAll(" ", "-"));
    
    const allNotes = JSON.parse(localStorage.getItem("notes"));
    
    if(allNotes === null || Object.keys(allNotes).length === 0) localStorage.setItem("notes", JSON.stringify({ [`${formattedNoteObjectTitle}_0`]: noteObject }));

    else {
        const lastKey = Object.keys(allNotes)[Object.keys(allNotes).length - 1];
        const order = parseInt(lastKey.split("_")[1]) + 1;
        const id = `${formattedNoteObjectTitle}_${order}`;

        const newAllNotes = {...allNotes, [id]: noteObject};
        localStorage.setItem("notes", JSON.stringify(newAllNotes));
    }

    updateNotes();
}

let editInProgress = false;

function edit(e = null) {
    if(editInProgress) return;
    editInProgress = true;
    
    if(e) e.preventDefault();

    window.eventList.remove("notesKeyDown");

    const noteModal = document.querySelector(".note-modal");
    const validId = noteModal.id.split("-")[0];

    const noteObject = getFormData();

    const formattedNoteObjectTitle = Convert.cssToJsStandard(noteObject.title.replaceAll(" ", "-"));
    const order = parseInt(validId.split("_")[1]);

    const allNotes = JSON.parse(localStorage.getItem("notes"));
    let newAllNotes = {};

    Object.keys(allNotes).forEach((key, index) => {
        const noteOrder = parseInt(key.split("_")[1]);

        if(order === noteOrder) {
            noteModal.id = `${formattedNoteObjectTitle}_${order}-modal`;
            return newAllNotes = {...newAllNotes, [`${formattedNoteObjectTitle}_${order}`]: noteObject};
        }
        
        newAllNotes = {...newAllNotes, [key]: Object.values(allNotes)[index]};
    });

    localStorage.setItem("notes", JSON.stringify(newAllNotes));
    updateNotes();

    noteModal.style.height = "";
    noteModal.classList.add("edit-note-modal");
    
    setTimeout(() => {
        noteModal.innerHTML = "";
        
        Component.create("ModalOptions", {
            functions: { options: openOptionsModal, x: closeModal },
            appendTo: noteModal
        });

        Component.create("MoveModal", { appendTo: noteModal });
        
        const noteModalTitle = createElement({
            tag: "div",
            attributes: { class: "note-modal-title" },
            appendTo: noteModal
        });

        createElement({
            tag: "img",
            attributes: { src: noteObject.icon, alt: "NOTES" },
            appendTo: noteModalTitle
        });

        createElement({
            tag: "h3",
            innerText: noteObject.title,
            appendTo: noteModalTitle
        });

        Component.create("NoteModalView", { targetNote: noteObject, appendTo: noteModal });

        setTimeout(() => {
            TransitionDimensions.height(noteModal);
            
            setTimeout(() => {
                noteModal.classList.remove("edit-note-modal");
                editInProgress = false;
            }, 300);
        }, 100);
    }, 300);
}

function remove(confirm = false, id) {
    const type = path.substring(0, path.length - 1);
    const targetModal = document.querySelector(`.${type}-modal`);
    
    if(!confirm) return Component.create("ClassicModal", {
        text: `Do you really want to delete this note?`,
        buttons: ["no", "yes"],
        buttonsTrigger: { no: "Escape", yes: "Enter" },
        functions: { yes: () => NoteOptions.delete(true, id) },
        appendTo: targetModal ? targetModal : body
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
        if(existingNoteModalId === id) closeModal();
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
    const type = path.substring(0, path.length - 1);
    const targetModal = document.querySelector(`.${type}-modal`);
    
    const existingNoteModal = document.querySelector(".note-modal");

    if(existingNoteModal) {
        const noteModalId = existingNoteModal.id.split("-")[0];
        if(noteModalId === id) return;

        closeModal();
        return setTimeout(() => openModal(id), 300);
    }

    const targetNote = getTargetNote(id);

    Component.create("NoteModal", {
        type: id ? "view" : "add",
        targetNote: id ? targetNote : null,
        appendTo: targetModal ? targetModal : body
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

    setTimeout(() => {
        noteModal.remove();
        inProgress = false;
    }, 300);
}

function openOptionsModal() {
    const existingNoteOptionsModal = document.querySelector(".note-options-modal");
    if(existingNoteOptionsModal) return closeOptionsModal();
    
    const noteModal = document.querySelector(".note-modal");
    Component.create("NoteOptionsModal", { appendTo: noteModal });
}

function closeOptionsModal() {
    window.eventList.remove("noteOptionsModalClick");
    
    const noteOptionsModal = document.querySelector(".note-options-modal");

    noteOptionsModal.style.opacity = "0";
    noteOptionsModal.style.top = "60%";

    setTimeout(() => noteOptionsModal.remove(), 300);
}

function getFormData() {
    const fieldsets = document.querySelectorAll("fieldset");
    let noteObject = {};

    fieldsets.forEach((fieldset, index) => {
        if(!index) {
            const selectedIcon = document.getElementById("selected-icon");
            noteObject = {...noteObject, icon: selectedIcon.src};
        }
        
        else {
            const value = fieldset.children[1].value;
            noteObject = {...noteObject, [index === 1 ? "title" : "content"]: value};
        }
    });

    return noteObject;
}

function openInModal(type) {
    const targetModal = document.querySelector(`.${type}-modal`);
    const existingNotes = document.querySelector(`.${type}-modal .notes`);

    if(existingNotes) return closeInModal(type);
    
    const notes = Component.create("Notes", {
        style: {
            width: "385px",
            opacity: "0",
            position: "absolute",
            top: "50%",
            right: "-385px",
            transform: "translateY(-50%)"
        },
        appendTo: targetModal
    });

    setTimeout(() => {
        notes.style.opacity = "";
        notes.style.right = "10px";

        const modalOptionsNotesIcon = document.querySelectorAll(".modal-options img")[0];
        modalOptionsNotesIcon.style.opacity = "1";
    }, 100);
}

function closeInModal(type) {
    const notes = document.querySelector(`.${type}-modal .notes`);

    notes.style.opacity = "0";
    notes.style.right = "-385px";

    setTimeout(() => {
        notes.remove();

        const modalOptionsNotesIcon = document.querySelectorAll(".modal-options img")[0];
        modalOptionsNotesIcon.style.opacity = "";
    }, 300);
}