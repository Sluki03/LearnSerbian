import { NoteOptions } from "../../../functions/NoteOptions.js";
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