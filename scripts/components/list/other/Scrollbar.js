import createElement from "../../../functions/createElement.js";
import { Percentage } from "../../../functions/percentage.js";

export default function Scrollbar(componentProps) {
    const { builtIn } = componentProps;
    const { target, ignoreTarget, appendTo } = componentProps.params;

    const validTarget = builtIn ? builtIn.parentElement : target;
    const targetElement = ignoreTarget ? document.documentElement : validTarget ? validTarget : document.documentElement;

    const relativeToViewport = targetElement.isEqualNode(document.documentElement);
    
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
        style: { height: `${Percentage.calc(targetElement.scrollHeight, targetElement.clientHeight)}%` },
        events: [{ on: "mousedown", call: buttonScrolling }],
        appendTo: scrollbarLine
    });

    (relativeToViewport ? window : targetElement).eventList.add({ id: "scrollbarScroll", type: "scroll", listener: scrolling });

    let buttonScrollingStatus = false;

    absoluteScrollbar();

    function scrolling() {
        absoluteScrollbar();
        
        if(buttonScrollingStatus) return;
        scrollbarButton.style.top = `${Percentage.calc(targetElement.scrollHeight, targetElement.scrollTop)}%`;
    }

    function buttonScrolling(e) {
        buttonScrollingStatus = true;

        window.eventList.add({
            scrollbarMouseMove: { type: "mousemove", listener: mouseMove },
            scrollbarMouseUp: { type: "mouseup", listener: mouseUp }
        });

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
                
            targetElement.style.scrollBehavior = "auto";
            targetElement.scrollTop = Percentage.of(targetElement.scrollHeight, buttonTopPercentage);
            targetElement.style.scrollBehavior = "smooth";
        }

        function mouseUp() {
            buttonScrollingStatus = false;
            window.eventList.remove("scrollbarMouseMove", "scrollbarMouseUp");
        }
    }

    function absoluteScrollbar() {
        if(relativeToViewport) return;
        if(!scrollbarElement.classList.contains("absolute-scrollbar")) scrollbarElement.classList.add("absolute-scrollbar");
    
        scrollbarElement.style.top = `${Percentage.of(validTarget.clientHeight, 50) + validTarget.scrollTop}px`;
    }

    return scrollbarElement;
}