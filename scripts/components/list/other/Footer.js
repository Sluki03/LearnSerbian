import { footerData } from "../../../../data/footerData.js";
import createEelement from "../../../functions/element/createElement.js";

export default function Footer(componentProps) {
    const { builtIn } = componentProps;
    const { appendTo } = componentProps.params;

    const footerElement = builtIn ? builtIn : createEelement({ tag: "footer", appendTo });

    footerData.forEach(section => {
        const div = createEelement({ tag: "div", appendTo: footerElement });
        createEelement({ tag: "h3", innerText: section.title, appendTo: div });

        section.links.forEach(link => createEelement({
            tag: "a",
            innerText: link.title,
            events: [{ on: "click", call: () => window.open(link.href) }],
            appendTo: div
        }));
    });

    return footerElement;
}
