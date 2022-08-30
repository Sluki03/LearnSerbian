import { navButtonsData } from "../../../../data/navButtonsData.js";
import createElement from "../../../functions/createElement.js";
import { Component } from "../../component.js";

export default function nav() {
    const navElement = document.querySelector("nav");

    const homeLink = createElement({
        tag: "a",
        attributes: { href: "/index.html", class: "nav-logo" },
        appendTo: navElement
    });

    Component.create("interactiveTitle", "learn serbian", homeLink);

    const buttonHolder = createElement({ tag: "div", attributes: { class: "button-holder" }, appendTo: navElement });

    const pathname = window.location.pathname.substring(1).split(".")[0];
    const currentPage = pathname === "index" ? "home" : pathname;
    
    navButtonsData.forEach(button => createElement({
        tag: "a",
        attributes: { href: button.link, id: currentPage === button.title ? "current-page" : "" },
        innerText: button.title,
        appendTo: buttonHolder
    }));
}