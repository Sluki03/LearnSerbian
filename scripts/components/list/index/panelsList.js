import { indexPanelsData } from "../../../../data/indexPanelsData.js";
import createElement from "../../../functions/createElement.js";

export default function panelsList(componentProps) {
    const { builtIn } = componentProps;
    const [appendTo] = componentProps.params;

    const panels = builtIn ? builtIn : createElement({ tag: "div", attributes: { class: "panels" }, appendTo });

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