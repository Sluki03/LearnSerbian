import breakText from "../../functions/breakText.js";

export default function formatAnswer(thisExercise, type, acceptableAnswers, userAnswer = "") {
    const validAcceptableAnswers = thisExercise.currentTask.type === "listen" ? [thisExercise.currentTask.listenTo] : acceptableAnswers;
    
    let otherAnswers = validAcceptableAnswers;
    if(userAnswer && typeof userAnswer === "string") otherAnswers = otherAnswers.filter(answer => breakText(answer, { join: true }) !== breakText(userAnswer, { join: true }));
    
    const random = {
        correctAnswer: validAcceptableAnswers[Math.floor(Math.random() * validAcceptableAnswers.length)],
        otherCorrectAnswer: otherAnswers.length > 0 ? otherAnswers[Math.floor(Math.random() * otherAnswers.length)] : ""
    };
    
    const answers = {
        user: getFormattedAnswer(userAnswer),
        correct: getFormattedAnswer(validAcceptableAnswers)
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
            case "listen":
                formattedAnswer = [thisExercise.currentTask.listenTo];
                break;
            default: formattedAnswer = answerSrc;
        }

        return { content: formattedAnswer, isPlural };
    }
}