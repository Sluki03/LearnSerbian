import { indexPanelsData } from "../../../../data/indexPanelsData.js";
import createElement from "../../../functions/createElement.js";

export default function PanelsList(componentProps) {
    const { builtIn } = componentProps;
    const { appendTo } = componentProps.params;

    const panels = builtIn ? builtIn : createElement({ tag: "div", attributes: { class: "panels" }, appendTo });

    indexPanelsData.forEach((panelData) => {
        const panel = document.querySelector("[data-template='panel']").content.firstElementChild.cloneNode(true);
        panels.appendChild(panel);

        const [panelH1, panelP] = [...panel.children];

        panelH1.innerText = panelData.title;
        panelP.innerText = panelData.description;
    });

    return panels;
}
