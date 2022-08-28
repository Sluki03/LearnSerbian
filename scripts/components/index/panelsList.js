import { indexPanelsData } from "../../../data/indexPanelsData.js";
import createElement from "../../functions/createElement.js";

export default function panelsList() {
    const panels = document.querySelector(".info-content .panels");

    indexPanelsData.forEach((panelData) => {
        const panel = createElement({
            tag: "article",
            attributes: { class: "panel" },
            appendTo: panels
        });

        createElement({
            tag: "h1",
            innerText: panelData.title,
            appendTo: panel
        });

        createElement({
            tag: "p",
            innerText: panelData.description,
            appendTo: panel
        });
    });
}