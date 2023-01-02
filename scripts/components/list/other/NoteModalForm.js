import { Component } from "../../Component.js";
import { noteIconsData } from "../../../../data/noteIconsData.js";
import { TransitionDimensions } from "../../../functions/TransitionDimensions.js";
import { NoteOptions } from "../../../functions/NoteOptions.js";
import createElement from "../../../functions/createElement.js";

export default function NoteModalForm(componentProps) {
    const { builtIn } = componentProps;
    const { type, data, appendTo } = componentProps.params;

    const noteModalForm = builtIn ? builtIn : createElement({
        tag: "form",
        events: [{ on: "submit", call: type === "edit" ? NoteOptions.edit : NoteOptions.create }],
        appendTo
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
            appendTo: noteModalForm
        });

        let value = "";
        
        if(data) {
            if(element.id === "title") value = data.title;
            else if(element.id === "content") value = data.content;
        }

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
                maxLength: element.id === "title" ? "18" : "500",
                rows: element.rows ? element.rows : "",
                columns: element.columns ? element.columns : "",
            },
            value,
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

    (data ? data.icons : noteIconsData).forEach((icon, index) => createElement({
        tag: "img",
        attributes: {
            src: icon,
            alt: "NOTE",
            id: !index ? "selected-icon" : "",
            class: noteIconsData.length -1 === index ? "upload-icon" : ""
        },
        style: { left: `${0 + (index * 40)}px` },
        events: [{ on: "click", call: selectIcon }],
        appendTo: iconsList
    }));

    const input = document.querySelector(".note-modal input");
    input.focus();

    const selectedIcon = document.getElementById("selected-icon");
    const selectedIconDirectories = selectedIcon.src.split("/");
    
    const defaultInputValuesObject = {
        img: selectedIconDirectories[selectedIconDirectories.length - 1],
        input: type === "edit" ? data.title : "",
        textarea: type === "edit" ? data.content : ""
    }
    
    const inputValues = { start: defaultInputValuesObject, current: defaultInputValuesObject };

    const submitButton = createElement({
        tag: "button",
        attributes: { class: "classic-button disabled-classic-button" },
        innerText: type === "edit" ? "edit" : "create",
        appendTo: noteModalForm
    });

    return noteModalForm;

    function expandIconsHolder() {
        window.eventList.add({ id: "noteModalChangeIconClick", type: "click", listener: minimizeIconsHolder });

        if(!iconsHolder.classList.contains("expanded-icons-holder")) {
            TransitionDimensions.width(iconsHolder);
            iconsHolder.classList.add("expanded-icons-holder");
        }

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

        if(e.target.classList.contains("upload-icon")) {
            const noteModal = document.querySelector(".note-modal");
            Component.create("NoteIconModal", { appendTo: noteModal });
        }
        
        inputChecker(e);
    }

    function inputChecker(e) {
        const target = e.target;
        const key = target.nodeName.toLowerCase();

        const selectedIcon = document.getElementById("selected-icon");
        const selectedIconDirectories = selectedIcon.src.split("/");

        inputValues.current = {...inputValues.current, [key]: e.type === "input" ? target.value : selectedIconDirectories[selectedIconDirectories.length - 1]};

        let isValid = true;

        Object.values(inputValues.current).forEach(value => { if(!value) isValid = false });
        
        if(
            inputValues.current.img === inputValues.start.img &&
            inputValues.current.input === inputValues.start.input &&
            inputValues.current.textarea === inputValues.start.textarea
        ) isValid = false;

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

        if(!textarea.isEqualNode(document.activeElement)) type === "edit" ? NoteOptions.edit() : NoteOptions.create();
    }
}