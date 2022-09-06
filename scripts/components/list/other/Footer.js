import { footerData } from "../../../../data/footerData.js";
import createEelement from "../../../functions/createElement.js";

export default function Footer(componentProps) {
    const { builtIn } = componentProps;
    const { appendTo } = componentProps.params;

    const footerElement = builtIn ? builtIn : createEelement({ tag: "footer", appendTo });

    footerData.forEach(section => {
        const div = createEelement({ tag: "div", appendTo: footerElement });
        createEelement({ tag: "h3", innerText: section.title, appendTo: div });

        section.links.forEach(link => createEelement({
            tag: "a",
            attributes: { href: link.href },
            innerText: link.title,
            appendTo: div
        }));
    });

    return footerElement;
}
