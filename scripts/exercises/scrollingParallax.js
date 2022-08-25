export default function scrollingParallax() {
    const exercisesHolder = document.querySelector(".exercises-holder");
    let scrollPosition = exercisesHolder.scrollTop;

    exercisesHolder.addEventListener("scroll", makeParallax, { passive: true });

    function makeParallax() {
        const exercisesHolderBgY = parseInt(getComputedStyle(exercisesHolder).getPropertyValue("background-position-y"));

        const direction = scrollPosition > exercisesHolder.scrollTop ? "up" : "down";
        scrollPosition = exercisesHolder.scrollTop;

        const bgMove = 25;

        if(direction === "up") exercisesHolder.style.backgroundPositionY = `${exercisesHolderBgY - bgMove}px`;
        else exercisesHolder.style.backgroundPositionY = `${exercisesHolderBgY + bgMove}px`;
    }
}