export default function transitionHeightChange(element) {
    element.style.height = "auto";
    
    const realHeight = element.getBoundingClientRect().height.toFixed(2);
    element.style.height = "";

    setTimeout(() => { element.style.height = `${realHeight}px` }, 10);
}