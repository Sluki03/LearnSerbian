import createElement from "./createElement.js";

export default function getComponents(...components) {
    const COMPONENTS = {
        INTERACTIVE_TITLE: "interactiveTitle"
    };

    for(let i = 0; i < components.length; i++) {
        switch(components[i]) {
            case COMPONENTS.INTERACTIVE_TITLE: {
                const interactiveTitles = document.querySelectorAll(".interactive-title");
                
                interactiveTitles.forEach(interactiveTitle => {
                    const title = interactiveTitle.dataset.title;

                    for(let i = 0; i < 3; i++) createElement({
                        tag: "span",
                        innerText: title,
                        appendTo: interactiveTitle
                    });
                });
            }

            default: return;
        }
    }
}