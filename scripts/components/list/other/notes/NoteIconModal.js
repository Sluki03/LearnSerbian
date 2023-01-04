import { Component } from "../../../Component.js";
import createElement from "../../../../functions/element/createElement.js";

export default function NoteIconModal(componentProps) {
    const { builtIn } = componentProps;
    const { appendTo } = componentProps.params;

    const noteIconModal = builtIn ? builtIn : createElement({
        tag: "div",
        attributes: { class: "note-icon-modal" },
        appendTo
    });

    setTimeout(() => noteIconModal.classList.add("active-note-modal"), 100);

    Component.create("ModalOptions", {
        functions: { x: closeNoteIconModal },
        appendTo: noteIconModal
    });

    const noteIconModalTitle = createElement({
        tag: "div",
        attributes: { class: "note-icon-modal-title" },
        appendTo: noteIconModal
    });

    createElement({
        tag: "img",
        attributes: { src: "./images/icons/image-icon.png", alt: "IMAGE" },
        appendTo: noteIconModalTitle
    });

    createElement({
        tag: "h4",
        innerText: "upload icon",
        appendTo: noteIconModalTitle
    });

    const uploadHolder = createElement({
        tag: "div",
        attributes: { class: "upload-holder" },
        appendTo: noteIconModal
    });

    createElement({
        tag: "input",
        attributes: {
            type: "file",
            title: "",
            class: "upload-image-input",
            accept: "image/png, image/jpeg, image/jpg, image/gif"
        },
        events: [
            { on: "change", call: uploadIcon },
            { on: "dragenter", call: () => uploadHolderAnimation(true) },
            { on: "dragleave", call: () => uploadHolderAnimation(false) },
            { on: "drop", call: () => uploadHolderAnimation(false) }
        ],
        appendTo: uploadHolder
    });

    const imgHolder = createElement({
        tag: "div",
        attributes: { class: "img-holder" },
        appendTo: uploadHolder
    });
    
    createElement({
        tag: "img",
        attributes: { src: "./images/icons/question-icon.png", alt: "IMAGE" },
        appendTo: imgHolder
    });

    for(let i = 0; i < 3; i++) createElement({
        tag: "div",
        attributes: { class: "img-circle", id: `img-circle-${i + 1}` },
        appendTo: uploadHolder
    });

    const saveButton = createElement({
        tag: "button",
        attributes: { class: "disabled-classic-button" },
        innerText: "save",
        events: [{ on: "click", call: saveIcon }],
        appendTo: noteIconModal
    });

    return noteIconModal;

    function closeNoteIconModal() {
        noteIconModal.style.opacity = "0";
        noteIconModal.style.top = "60%";

        setTimeout(() => noteIconModal.remove(), 300);
    }

    function uploadIcon() {
        const input = document.querySelector(".upload-image-input");
        const image = document.querySelector(".upload-holder .img-holder img");

        const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/gif"];
        
        if(input.files[0] === undefined) return;
        if(allowedTypes.indexOf(input.files[0].type) === -1) return;

        const reader = new FileReader();
        reader.readAsDataURL(input.files[0]);
        
        reader.onload = e => {
            image.src = e.target.result;
            saveButton.classList.remove("disabled-classic-button");
        }
        
    }

    function saveIcon() {
        const image = document.querySelector(".upload-holder .img-holder img");
        const icon = image.src;

        closeNoteIconModal();

        const selectedIcon = document.getElementById("selected-icon");
        selectedIcon.src = icon;
    }

    function uploadHolderAnimation(isActive) {
        if(isActive) uploadHolder.classList.add("active-upload-holder");
        else uploadHolder.classList.remove("active-upload-holder");
    }
}