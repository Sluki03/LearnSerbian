import { Component } from "../../Component.js";
import { Convert } from "../../../functions/Convert.js";
import { NoteModalOptions } from "../../../functions/NoteModalOptions.js";
import createElement from "../../../functions/createElement.js";
import updateNotes from "../../../functions/updateNotes.js";
import markdown from "../../../functions/markdown.js";

export default function NoteModal(componentProps) {
    const { builtIn } = componentProps;
    const { type, targetNote, appendTo } = componentProps.params;

    const noteModal = builtIn ? builtIn : createElement({
        tag: "div",
        attributes: { class: "note-modal", id: targetNote ? `${targetNote.id}-modal` : "" },
        appendTo
    });

    setTimeout(() => noteModal.classList.add("active-note-modal"), 100);

    Component.create("ModalOptions", {
        functions: { x: NoteModalOptions.close },
        appendTo: noteModal
    });
    
    const noteModalTitle = createElement({
        tag: "div",
        attributes: { class: "note-modal-title" },
        appendTo: noteModal
    });

    createElement({
        tag: "img",
        attributes: { src: "./images/icons/notes-icon.png", alt: "NOTES" },
        appendTo: noteModalTitle
    });
    
    createElement({
        tag: "h3",
        innerText: targetNote ? targetNote.title : "add note",
        appendTo: noteModalTitle
    });

    if(type === "add") {
        const form = createElement({
            tag: "form",
            events: [{ on: "submit", call: createNote }],
            appendTo: noteModal
        });
    
        window.eventList.add({ id: "notesKeyDown", type: "keydown", listener: createNoteKeyDown });
    
        for(let i = 0; i < 2; i++) {
            const fieldset = createElement({
                tag: "fieldset",
                appendTo: form
            });
    
            createElement({
                tag: "label",
                attributes: { for: i ? "content" : "title" },
                innerText: `${i ? "content" : "title"}:`,
                appendTo: fieldset
            });
    
            createElement({
                tag: i ? "textarea" : "input",
                attributes: {
                    id: i ? "content" : "title",
                    type: "text",
                    placeholder: i ? "Your content..." : "e.g. Words meaning",
                    rows: "5",
                    columns: "10"
                },
                appendTo: fieldset
            });
        }
    
        createElement({
            tag: "button",
            attributes: { class: "classic-button" },
            innerText: "submit",
            appendTo: form
        });
    }

    else {
        const contentHolder = createElement({
            tag: "div",
            attributes: { class: "content-holder" },
            appendTo: noteModal
        });
        
        createElement({
            tag: "p",
            innerHTML: markdown(targetNote.content),
            appendTo: contentHolder
        });

        Component.create("Scrollbar", { appendTo: contentHolder });
    }

    function createNote(e = null) {
        if(e) e.preventDefault();
        NoteModalOptions.close();

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

    function createNoteKeyDown(e) {
        const textarea = document.querySelector("fieldset textarea");
        const isTextareaActive = textarea.isEqualNode(document.activeElement);
        
        if(e.key === "Enter" && !isTextareaActive) createNote();
    }

    return noteModal;
}