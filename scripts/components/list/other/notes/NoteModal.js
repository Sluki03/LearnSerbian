import { Component } from "../../../Component.js";
import { NoteOptions } from "../../../../functions/notes/NoteOptions.js";
import createElement from "../../../../functions/element/createElement.js";

export default function NoteModal(componentProps) {
    const { builtIn } = componentProps;
    const { type, targetNote, appendTo } = componentProps.params;

    const noteModal = builtIn ? builtIn : createElement({
        tag: "div",
        attributes: { class: "note-modal", id: targetNote ? `${targetNote.id}-modal` : "" },
        appendTo
    });

    setTimeout(() => noteModal.classList.add("active-note-modal"), 100);

    const functions = {};
    
    if(type === "view") functions.options = NoteOptions.openOptionsModal;
    functions.x = NoteOptions.closeModal;

    Component.create("ModalOptions", { functions, appendTo: noteModal });
    Component.create("MoveModal", { appendTo: noteModal });
    
    const noteModalTitle = createElement({
        tag: "div",
        attributes: { class: "note-modal-title" },
        appendTo: noteModal
    });

    createElement({
        tag: "img",
        attributes: { src: targetNote ? targetNote.icon : "./images/icons/notes-icon.png", alt: "NOTES" },
        appendTo: noteModalTitle
    });
    
    createElement({
        tag: "h3",
        innerText: targetNote ? targetNote.title : "Add Note",
        appendTo: noteModalTitle
    });

    if(type === "add") Component.create("NoteModalForm", { appendTo: noteModal });
    else Component.create("NoteModalView", { targetNote, appendTo: noteModal });

    return noteModal;
}