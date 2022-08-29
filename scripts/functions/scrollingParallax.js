export default function scrollingParallax(parallaxObj) {
    const { scroll, bg } = parallaxObj;
    
    let scrollPosition = scroll.scrollTop;

    scroll.addEventListener("scroll", makeParallax, { passive: true });

    function makeParallax() {
        const bgY = parseInt(getComputedStyle(bg).getPropertyValue("background-position-y"));

        const direction = scrollPosition > bg.scrollTop ? "up" : "down";
        scrollPosition = bg.scrollTop;

        const bgMove = 3;

        if(direction === "up") bg.style.backgroundPositionY = `${bgY - bgMove}px`;
        else bg.style.backgroundPositionY = `${bgY + bgMove}px`;
    }
}