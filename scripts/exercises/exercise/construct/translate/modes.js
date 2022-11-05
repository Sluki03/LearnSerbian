export default function modes(thisExercise) {
    if(thisExercise.currentTask.mode.type === "write") {
        thisExercise.currentTask.mode.type = "wordBank";

        const translateHolderTextarea = document.querySelector(".translate-holder textarea");
        thisExercise.prevModeValues.write.translate.textareaValue = translateHolderTextarea.value;

        let textHolderWords = [];

        textHolderWords = translateHolderTextarea.value.split(" ");

        const punctuationMarks = [".", ",", "?", "!", ":", ";"];
        textHolderWords = textHolderWords.filter(word => punctuationMarks.indexOf(word) === -1);

        for(let i = 0; i < textHolderWords.length; i++) textHolderWords[i] = textHolderWords[i].toLowerCase();

        const words = {
            textHolder: [],
            wordBank: []
        };

        textHolderWords.forEach(word => {
            if(thisExercise.currentTask.options.indexOf(word) > -1) words.textHolder.push(word);
        });

        thisExercise.currentTask.options.forEach(option => {
            if(words.textHolder.indexOf(option) === -1) words.wordBank.push(option);
        });

        thisExercise.prevModeValues.wordBank.translate = words;
    }
    
    else {
        thisExercise.currentTask.mode.type = "write";

        const words = {
            textHolder: [],
            wordBank: []
        };

        const textHolder = document.querySelector(".text-holder");
        const wordsBankOptionsHolder = document.querySelector(".word-bank-options-holder");
        
        [...textHolder.children].forEach(child => {
            const childText = child.innerText;
            words.textHolder.push(childText);
        });

        [...wordsBankOptionsHolder.children].forEach(child => {
            const childText = child.innerText;
            words.wordBank.push(childText);
        });

        thisExercise.prevModeValues.wordBank.translate = words;
        thisExercise.prevModeValues.write.translate.textareaValue = words.textHolder.join(" ");
    }
}