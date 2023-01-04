export default function breakText(text, options) {    
    const defaultOptions = {
        lowerCase: true,
        removePuncuation: true,
        join: false
    };

    const currentOptions = options ? {...defaultOptions, ...options} : defaultOptions;
    
    let brokenText = text.split(" ");
    const validText = [];

    const punctuationMarks = [".", ",", "?", "!", ":", ";"];

    brokenText.forEach(word => {
        if(currentOptions.lowerCase) word = word.toLowerCase();
        if(currentOptions.removePuncuation) punctuationMarks.forEach(mark => word = word.replaceAll(mark, ""));
        
        if(word) validText.push(word);
    });

    return currentOptions.join ? validText.join(" ") : validText;
}