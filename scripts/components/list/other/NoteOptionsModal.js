import { Component } from "../../Component.js";
import { NoteOptions } from "../../../functions/NoteOptions.js";
import { TransitionDimensions } from "../../../functions/TransitionDimensions.js";
import { noteIconsData } from "../../../../data/noteIconsData.js";
import createElement from "../../../functions/createElement.js";

export default function NoteOptionsModal(componentProps) {
    const { builtIn } = componentProps;
    const { appendTo } = componentProps.params;

    const noteOptionsModal = builtIn ? builtIn : createElement({
        tag: "div",
        attributes: { class: "note-options-modal" },
        appendTo
    });

    setTimeout(() => {
        noteOptionsModal.classList.add("active-note-options-modal");
        window.eventList.add({ id: "noteOptionsModalClick", type: "click", listener: closeNoteOptionsModal });
    }, 100);

    const options = ["edit", "download", "delete"];
    const functions = [editNote, downloadNote, deleteNote];

    options.forEach((option, index) => {
        const button = createElement({
            tag: "button",
            events: [{ on: "click", call: functions[index] }],
            appendTo: noteOptionsModal
        });

        createElement({
            tag: "img",
            attributes: { src: `./images/icons/${option}-icon.png`, alt: option.toUpperCase() },
            appendTo: button
        });

        createElement({
            tag: "p",
            innerText: option,
            appendTo: button
        });
    });

    return noteOptionsModal;

    function closeNoteOptionsModal(e) {
        let closeStatus = true;

        e.composedPath().forEach(element => {
            if(element.classList === undefined) return;
            if(element.classList.contains("note-options-modal")) closeStatus = false;
        });

        if(closeStatus) NoteOptions.closeOptionsModal();
    }

    function editNote() {
        NoteOptions.closeOptionsModal();
        
        setTimeout(() => {
            const noteModal = document.querySelector(".note-modal");

            const validId = noteModal.id.split("-")[0];
            const allNotes = JSON.parse(localStorage.getItem("notes"));
        
            let data = {};
        
            Object.keys(allNotes).forEach((key, index) => {
                if(validId !== key) return;
                
                const value = Object.values(allNotes)[index];
        
                const icons = [value.icon];
                let matching = false;
        
                noteIconsData.forEach((icon, index) => {
                    if((noteIconsData.length - 1 === index) && !matching) return;
        
                    const directories = {
                        valueIcon: value.icon.split("/"),
                        icon: icon.split("/")
                    };
                    
                    const realNames = {
                        valueIcon: directories.valueIcon[directories.valueIcon.length - 1],
                        icon: directories.icon[directories.icon.length - 1]
                    };
                    
                    if(realNames.valueIcon === realNames.icon) return matching = true;
                    icons.push(icon);
                });
        
                data = { icons, title: value.title, content: value.content };
            });
        
            const noteModalHeight = noteModal.getBoundingClientRect().height;
            
            noteModal.style.transition = "0ms";
            noteModal.style.height = `${noteModalHeight}px`;
            noteModal.style.transition = "";
        
            setTimeout(() => {
                noteModal.style.height = "";
                noteModal.classList.add("edit-note-modal");
            }, 10);
        
            setTimeout(() => {
                noteModal.innerHTML = "";
        
                Component.create("ModalOptions", {
                    functions: { x: NoteOptions.closeModal },
                    appendTo: noteModal
                });
                
                const noteModalTitle = createElement({
                    tag: "div",
                    attributes: { class: "note-modal-title" },
                    appendTo: noteModal
                });
        
                createElement({
                    tag: "img",
                    attributes: { src: "./images/icons/edit-icon.png", alt: "EDIT" },
                    appendTo: noteModalTitle
                });
        
                createElement({
                    tag: "h3",
                    innerText: "Edit Note",
                    appendTo: noteModalTitle
                });
        
                Component.create("NoteModalForm", { type: "edit", data, appendTo: noteModal });
                
                setTimeout(() => {
                    TransitionDimensions.height(noteModal);
                    setTimeout(() => noteModal.classList.remove("edit-note-modal"), 300);
                }, 100);
            }, 300);
        }, 300);
    }

    function downloadNote(e) {
        const id = getId(e);
        NoteOptions.download(id);
    }

    function deleteNote(e) {
        const id = getId(e);
        NoteOptions.delete(false, id);
    }

    function getId(e) {
        let noteModal = null;
        
        e.composedPath().forEach(element => {
            if(element.classList === undefined) return;
            if(element.classList.contains("note-modal")) noteModal = element;
        });

        const id = noteModal.id.split("-")[0];
        return id;
    }
}