export default function modes(thisExercise) {
    const conversationAnswerInput = document.querySelector(".conversation-answer input");
    const conversationAnswerButtonHolder = document.querySelector(".conversation-answer-button-holder");

    if(thisExercise.currentTask.mode.type === "write") {
        thisExercise.currentTask.mode.type = "multipleChoice";
        thisExercise.prevModeValues.write.conversation.value = conversationAnswerInput.value;
    }

    else {
        thisExercise.currentTask.mode.type = "write";
                    
        const classes = [];

        [...conversationAnswerButtonHolder.children].forEach(child => {      
            [...child.classList].forEach(className => {
                    if(className === "multiple-choice-button") return;
                    classes.push(className);
            });
        });

        thisExercise.prevModeValues.multipleChoice.conversation.classes = classes;
    }
}