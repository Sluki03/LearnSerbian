import breakText from "../functions/text/breakText.js";

export default function formatAnswer(type, acceptableAnswers, userAnswer = "") {
    let otherAnswers = acceptableAnswers;
    if(userAnswer && typeof userAnswer === "string") otherAnswers = otherAnswers.filter(answer => breakText(answer, { join: true }) !== breakText(userAnswer, { join: true }));
    
    const random = {
        correctAnswer: acceptableAnswers[Math.floor(Math.random() * acceptableAnswers.length)],
        otherCorrectAnswer: otherAnswers.length > 0 ? otherAnswers[Math.floor(Math.random() * otherAnswers.length)] : ""
    };
    
    const answers = {
        user: getFormattedAnswer(userAnswer),
        correct: getFormattedAnswer(acceptableAnswers)
    };

    return [answers, random];

    function getFormattedAnswer(answerSrc) {
        if(typeof answerSrc === "object") answerSrc = Object.values(answerSrc);
        
        let formattedAnswer = "";
        let isPlural = false;
    
        switch(type) {
            case "connect":
                if(Array.isArray(answerSrc)) formattedAnswer = `${answerSrc[0]} --> ${answerSrc[1]}`;
                break;
            case "completeText":
                if(Array.isArray(answerSrc)) {
                    formattedAnswer = `${answerSrc.join(", ")}`;
                    isPlural = true;
                }

                break;
            default: formattedAnswer = answerSrc;
        }

        return { content: formattedAnswer, isPlural };
    }
}