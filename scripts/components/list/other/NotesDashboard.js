import { Component } from "../../Component.js";
import { NoteOptions } from "../../../functions/NoteOptions.js";
import createElement from "../../../functions/createElement.js";
import { TransitionDimensions } from "../../../functions/TransitionDimensions.js";
import updateNotes from "../../../functions/updateNotes.js";

export default function NotesDashboard(componentProps) {
    const { builtIn } = componentProps;
    const { appendTo } = componentProps.params;

    const notesDashboard = builtIn ? builtIn : createElement({
        tag: "div",
        attributes: { class: "notes-dashboard" },
        appendTo
    });

    const buttons = ["download", "delete"];

    buttons.forEach((button, index) => {
        const dashboardButton = createElement({
            tag: "button",
            events: [{ on: "click", call: index ? multipleDelete : multipleDownload }],
            appendTo: notesDashboard
        });

        createElement({
            tag: "img",
            attributes: { src: `./images/icons/${button}-icon.png`, alt: button.toUpperCase() },
            appendTo: dashboardButton
        });

        createElement({
            tag: "p",
            innerText: button,
            appendTo: dashboardButton
        });
    });

    TransitionDimensions.height(notesDashboard);

    function multipleDownload() {
        const checkedNotes = document.querySelectorAll(".checked-note");
        
        if(checkedNotes.length === 1) {
            NoteOptions.download(checkedNotes[0].id);
            
            uncheckNotes();
            return updateNotes();
        }
        
        const zip = new JSZip();
        const allNotes = JSON.parse(localStorage.getItem("notes"));
        
        checkedNotes.forEach(checkedNote => {
            let targetNote = {};

            Object.keys(allNotes).forEach((key, index) => {
                if(checkedNote.id === key) targetNote = Object.values(allNotes)[index];
            });
            
            zip.file(`${targetNote.title}.txt`, targetNote.content);
        });

        zip.generateAsync({ type: "blob" }).then(content => {
            saveAs(content, "Notes.zip");

            uncheckNotes();
            updateNotes();
        });

        function uncheckNotes() {
            checkedNotes.forEach(checkedNote => {
                checkedNote.classList.remove("checked-note");

                const noteCheck = checkedNote.querySelector(".note-check");
                noteCheck.classList.remove("active-note-check");
            });

            notesDashboard.style.height = "";
            setTimeout(() => notesDashboard.remove(), 300);
        }
    }
    
    function multipleDelete() {
        const checkedNotes = document.querySelectorAll(".checked-note");
        const body = document.querySelector("body");
        const exerciseModal = document.querySelector(".exercise-modal");

        Component.create("ClassicModal", {
            text: `Do you really want to delete this note${checkedNotes.length > 1 ? "s" : ""}?`,
            buttons: ["no", "yes"],
            buttonsTrigger: { no: "Escape", yes: "Enter" },
            functions: { yes: confirmedDelete },
            appendTo: exerciseModal ? exerciseModal : body
        });

        function confirmedDelete() {
            checkedNotes.forEach(checkedNote => NoteOptions.delete(true, checkedNote.id));

            notesDashboard.style.height = "";
            setTimeout(() => notesDashboard.remove(), 300);
        }
    }

    return notesDashboard;
}