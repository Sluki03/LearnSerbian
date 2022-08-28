import { navButtonsData } from "../../../data/navButtonsData.js";
import createElement from "../../functions/createElement.js";

export default function nav(specialId) {
    const body = document.querySelector("body");
    const firstElement = document.querySelector("body").firstChild;

    const navElement = createElement({
        tag: "nav",
        attributes: { id: specialId ? specialId : "" },
        appendTo: body,
        before: firstElement
    });

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

    navButtonsData.forEach(button => createElement({
        tag: "a",
        attributes: { href: button.link },
        innerText: button.title,
        appendTo: buttonHolder
    }));
}