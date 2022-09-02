import { navButtonsData } from "../../../../data/navButtonsData.js";
import createElement from "../../../functions/createElement.js";
import { Component } from "../../Component.js";

export default function Nav(componentProps) {
    const { builtIn } = componentProps;
    const [id, appendTo] = componentProps.params;
    
    const navElement = builtIn ? builtIn : createElement({ tag: "nav", attributes: { id }, appendTo });

    const homeLink = createElement({
        tag: "a",
        attributes: { href: "/index.html", class: "nav-logo" },
        appendTo: navElement
    });

    Component.create("InteractiveTitle", "learn serbian", homeLink);

    const buttonHolder = createElement({ tag: "div", attributes: { class: "button-holder" }, appendTo: navElement });

    const pathname = window.location.pathname.substring(1).split(".")[0];
    const currentPage = pathname === "index" ? "home" : pathname;
    
    navButtonsData.forEach(button => createElement({
        tag: "a",
        attributes: { href: button.link, id: currentPage === button.title ? "current-page" : "" },
        innerText: button.title,
        appendTo: buttonHolder
    }));

    return navElement;
}