import { Component } from "../../Component.js";
import createElement from "../../../functions/createElement.js";
import markdown from "../../../functions/markdown.js";

export default function NoteModalView(componentProps) {
    const { builtIn } = componentProps;
    const { targetNote, appendTo } = componentProps.params;

    const noteModalView = builtIn ? builtIn : createElement({
        tag: "div",
        attributes: { class: "note-modal-view" },
        appendTo
    });

    const contentHolder = createElement({
        tag: "div",
        attributes: { class: "content-holder" },
        appendTo: noteModalView
    });
    
    createElement({
        tag: "p",
        innerHTML: markdown(targetNote.content),
        appendTo: contentHolder
    });

    Component.create("Scrollbar", { appendTo: contentHolder });

    return noteModalView;
}