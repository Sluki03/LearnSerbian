export default function modes(thisTask) {
    const conversationAnswerInput = document.querySelector(".conversation-answer input");
    const conversationAnswerButtonHolder = document.querySelector(".conversation-answer-button-holder");

    if(thisTask.currentTask.mode.type === "write") {
        thisTask.currentTask.mode.type = "multipleChoice";
        thisTask.prevModeValues.write.conversation.value = conversationAnswerInput.value;
    }

    else {
        thisTask.currentTask.mode.type = "write";
                    
        const classes = [];

        [...conversationAnswerButtonHolder.children].forEach(child => {      
            [...child.classList].forEach(className => {
                    if(className === "multiple-choice-button") return;
                    classes.push(className);
            });
        });

        thisTask.prevModeValues.multipleChoice.conversation.classes = classes;
    }
}