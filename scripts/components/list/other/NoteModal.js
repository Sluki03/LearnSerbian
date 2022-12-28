import { Component } from "../../Component.js";
import { NoteOptions } from "../../../functions/NoteOptions.js";
import { TransitionDimensions } from "../../../functions/TransitionDimensions.js";
import { noteIconsData } from "../../../../data/noteIconsData.js";
import createElement from "../../../functions/createElement.js";
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

    const functions = {};
    
    if(type === "view") functions.options = NoteOptions.openOptionsModal;
    functions.x = NoteOptions.closeModal;

    Component.create("ModalOptions", { functions, appendTo: noteModal });
    
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

    if(type === "add") {
        const form = createElement({
            tag: "form",
            events: [{ on: "submit", call: NoteOptions.create }],
            appendTo: noteModal
        });
    
        window.eventList.add({ id: "notesKeyDown", type: "keydown", listener: notesKeydown });
    
        const formScheme = [
            { tag: "div", id: "icon", class: "icons-holder" },
            { tag: "input", id: "title", type: "text", placeholder: "e.g. Words meaning" },
            { tag: "textarea", id: "content", placeholder: "Your content...", rows: "5", columns: "10" }
        ];
        
        formScheme.forEach((element, index) => {
            const fieldset = createElement({
                tag: "fieldset",
                attributes: { class: !index ? "icon-fieldset" : "" },
                appendTo: form
            });
    
            createElement({
                tag: "label",
                attributes: { for: element.id },
                innerText: `${element.id}:`,
                appendTo: fieldset
            });
    
            createElement({
                tag: element.tag,
                attributes: {
                    class: element.class ? element.class : "",
                    id: element.id,
                    type: element.type ? element.type : "",
                    placeholder: element.placeholder ? element.placeholder : "",
                    rows: element.rows ? element.rows : "",
                    columns: element.columns ? element.columns : ""
                },
                events: index ? [{ on: "input", call: e => inputChecker(e) }] : [],
                appendTo: fieldset
            });
        });

        const iconsHolder = document.querySelector(".icons-holder");
        iconsHolder.onclick = expandIconsHolder;

        const iconsList = createElement({
            tag: "div",
            attributes: { class: "icons-list" },
            style: { width: `${noteIconsData.length * 40 - 10}px` },
            appendTo: iconsHolder
        });

        noteIconsData.forEach((icon, index) => createElement({
            tag: "img",
            attributes: { src: icon, alt: "NOTE", id: !index ? "selected-icon" : "" },
            style: { left: `${0 + (index * 40)}px` },
            events: [{ on: "click", call: selectIcon }],
            appendTo: iconsList
        }));

        const input = document.querySelector(".note-modal input");
        input.focus();

        let inputValues = { input: "", textarea: "" };
    
        const submitButton = createElement({
            tag: "button",
            attributes: { class: "classic-button disabled-classic-button" },
            innerText: "submit",
            appendTo: form
        });

        function expandIconsHolder() {
            window.eventList.add({ id: "noteModalChangeIconClick", type: "click", listener: minimizeIconsHolder });

            TransitionDimensions.width(iconsHolder);
            iconsHolder.classList.add("expanded-icons-holder");

            function minimizeIconsHolder(e) {
                let closeStatus = true;

                e.composedPath().forEach(element => {
                    if(element.classList === undefined) return;
                    if(element.classList.contains("icons-holder")) closeStatus = false;
                });

                if(closeStatus) {
                    window.eventList.remove("noteModalChangeIconClick");

                    iconsHolder.classList.remove("expanded-icons-holder");
                    iconsHolder.style.width = "";
                }
            }
        }

        function selectIcon(e) {
            if(!iconsHolder.classList.contains("expanded-icons-holder")) return;
            if(e.target.id === "selected-icon") return;

            const existingSelectedIcon = document.getElementById("selected-icon");
            
            const positions = {
                selectedIcon: parseInt(getComputedStyle(existingSelectedIcon).getPropertyValue("left")),
                newSelectedIcon: parseInt(getComputedStyle(e.target).getPropertyValue("left"))
            };
            
            existingSelectedIcon.style.left = `${positions.newSelectedIcon}px`;
            e.target.style.left = `${positions.selectedIcon}px`;

            existingSelectedIcon.id = "";
            e.target.id = "selected-icon";
        }

        function inputChecker(e) {
            const target = e.target;
            const key = target.nodeName.toLowerCase();

            inputValues = {...inputValues, [key]: target.value};

            let isValid = true;

            Object.values(inputValues).forEach(value => {
                if(!value) isValid = false;
            });

            if(isValid) submitButton.classList.remove("disabled-classic-button");
            else submitButton.classList.add("disabled-classic-button");
        }
    
        function notesKeydown(e) {
            if(e.key !== "Enter") return;
    
            const input = document.querySelector(".note-modal input");
            const textarea = document.querySelector(".note-modal textarea");
    
            if(input.isEqualNode(document.activeElement) && input.value) {
                e.preventDefault();
                textarea.focus();
            }

            if(!textarea.isEqualNode(document.activeElement)) NoteOptions.create();
        }
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

    return noteModal;
}