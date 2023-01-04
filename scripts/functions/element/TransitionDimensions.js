export const TransitionDimensions = { height, width };

function height(element) {
    element.style.height = "auto";
    
    const realHeight = element.getBoundingClientRect().height.toFixed(2);
    element.style.height = "";

    setTimeout(() => { element.style.height = `${realHeight}px` }, 10);
}

function width(element) {
    element.style.width = "auto";

    const realWidth = element.getBoundingClientRect().width.toFixed(2);
    element.style.width = "";

    setTimeout(() => { element.style.width = `${realWidth}px` }, 10);
}