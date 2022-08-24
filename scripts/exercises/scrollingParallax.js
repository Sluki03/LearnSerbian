export default function scrollingParallax() {
    const exercisesHolder = document.querySelector(".exercises-holder");
    const exercisesTree = document.querySelector(".exercises-tree");

    exercisesHolder.addEventListener("wheel", makeParallax, { passive: true });

    function makeParallax(event) {
        const exercisesHolderHeight = parseInt(getComputedStyle(exercisesHolder).getPropertyValue("height"));
        const exercisesHolderBgY = parseInt(getComputedStyle(exercisesHolder).getPropertyValue("background-position-y"));
        
        const exercisesTreeValues = {
            height: parseInt(getComputedStyle(exercisesTree).getPropertyValue("height")),
            top: parseInt(getComputedStyle(exercisesTree).getPropertyValue("top"))
        };

        const direction = event.deltaY > 0 ? "down" : "up";
        const moveValue = 100;

        if(direction === "up") {
            if(exercisesTreeValues.top === 0) return;
            if(exercisesTreeValues.top + moveValue > 0) exercisesTree.style.top = `${exercisesTreeValues.top + moveValue - (exercisesTreeValues.top + moveValue)}px`;
            else exercisesTree.style.top = `${exercisesTreeValues.top + moveValue}px`;

            exercisesHolder.style.backgroundPositionY = `${exercisesHolderBgY - moveValue / 4}px`;
        }

        else {
            if(exercisesTreeValues.top === (exercisesTreeValues.height - exercisesHolderHeight + 40) * -1) return;
            if(exercisesTreeValues.top - moveValue < (exercisesTreeValues.height - exercisesHolderHeight + 40) * -1) exercisesTree.style.top = `${exercisesTreeValues.top - moveValue + Math.abs(exercisesTreeValues.top - moveValue + (exercisesTreeValues.height - exercisesHolderHeight + 40))}px`;
            else exercisesTree.style.top = `${exercisesTreeValues.top - moveValue}px`;

            exercisesHolder.style.backgroundPositionY = `${exercisesHolderBgY + moveValue / 4}px`;
        }
    }
}