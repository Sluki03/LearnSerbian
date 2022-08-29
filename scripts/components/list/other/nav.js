import { navButtonsData } from "../../../../data/navButtonsData.js";
import createElement from "../../../functions/createElement.js";

export default function nav() {
    const navElement = document.querySelector("nav");

    const homeLink = createElement({
        tag: "a",
        attributes: { href: "/index.html", class: "nav-logo" },
        appendTo: navElement
    });

    createElement({
        tag: "img",
        attributes: { src: "images/icons/Learn Serbian - Watermark (Long with crown).png", alt: "Logo" },
        appendTo: homeLink
    });

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