export default function modes(thisTask) {
    if(thisTask.currentTask.mode.type === "write") {
        thisTask.currentTask.mode.type = "wordBank";

        const translateHolderTextarea = document.querySelector(".translate-holder textarea");
        thisTask.prevModeValues.write.translate.textareaValue = translateHolderTextarea.value;

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
            if(thisTask.currentTask.options.indexOf(word) > -1) words.textHolder.push(word);
        });

        thisTask.currentTask.options.forEach(option => {
            if(words.textHolder.indexOf(option) === -1) words.wordBank.push(option);
        });

        thisTask.prevModeValues.wordBank.translate = words;
    }
    
    else {
        thisTask.currentTask.mode.type = "write";

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

        thisTask.prevModeValues.wordBank.translate = words;
        thisTask.prevModeValues.write.translate.textareaValue = words.textHolder.join(" ");
    }
}