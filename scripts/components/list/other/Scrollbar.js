import createElement from "../../../functions/createElement.js";
import { Percentage } from "../../../functions/percentage.js";

export default function Scrollbar(componentProps) {
    const { builtIn } = componentProps;
    const { appendTo } = componentProps.params;

    const scrollbarElement = builtIn ? builtIn : createElement({
        tag: "div",
        attributes: { class: "scrollbar" },
        appendTo
    });

    const scrollbarLine = createElement({
        tag: "div",
        attributes: { class: "scrollbar-line" },
        appendTo: scrollbarElement
    });

    const scrollbarButton = createElement({
        tag: "button",
        style: { height: `${Percentage.calc(document.documentElement.scrollHeight, document.documentElement.clientHeight)}%` },
        events: [{ on: "mousedown", call: buttonScrolling }],
        appendTo: scrollbarLine
    });

    window.eventList.add({ id: "scrollbarScroll", type: "scroll", listener: scrolling });

    let buttonScrollingStatus = false;

    function scrolling() {
        if(buttonScrollingStatus) return;
        scrollbarButton.style.top = `${Percentage.calc(document.documentElement.scrollHeight, document.documentElement.scrollTop)}%`;
    }

    function buttonScrolling(e) {
        buttonScrollingStatus = true;
        
        window.eventList.add(
            { id: "scrollbarMouseMove", type: "mousemove", listener: mouseMove },
            { id: "scrollbarMouseUp", type: "mouseup", listener: mouseUp }
        );

        let clientY = e.clientY;

        function mouseMove(e) {
            const newClientY = e.clientY;

            const scrollbarButtonTop = parseFloat(getComputedStyle(scrollbarButton).getPropertyValue("top"));
            const scrollbarLineHeight = parseFloat(getComputedStyle(scrollbarLine).getPropertyValue("height"));
            
            const direction = newClientY < clientY ? "up" : "down";
            let difference = Math.abs(clientY - newClientY);

            clientY = newClientY;

            if(direction === "up") {
                if(scrollbarButtonTop - difference < 0) difference = difference - Math.abs(scrollbarButtonTop - difference);
                scrollbarButton.style.top = `${scrollbarButtonTop - difference}px`;
            }

            else {
                const scrollbarButtonHeight = parseFloat(getComputedStyle(scrollbarButton).getPropertyValue("height"));
                
                const buttonEndPosition = scrollbarButtonTop + scrollbarButtonHeight;

                if(buttonEndPosition + difference > scrollbarLineHeight) difference = difference - Math.abs(scrollbarLineHeight - (buttonEndPosition + difference));
                scrollbarButton.style.top = `${scrollbarButtonTop + difference}px`;
            }

            const buttonTopPercentage = Percentage.calc(scrollbarLineHeight, scrollbarButtonTop);
                
            document.documentElement.style.scrollBehavior = "auto";
            document.documentElement.scrollTop = Percentage.of(document.documentElement.scrollHeight, buttonTopPercentage);
            document.documentElement.style.scrollBehavior = "smooth";
        }

        function mouseUp() {
            buttonScrollingStatus = false;
            window.eventList.remove("scrollbarMouseMove", "scrollbarMouseUp");
        }
    }

    return scrollbarElement;
}