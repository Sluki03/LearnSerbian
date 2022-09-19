export const test1 = [
    {
        type: "translate",
        title: "Translate the following text:",
        text: "My name is Miki",
        acceptableAnswers: [
            "Ja se zovem Miki",
            "Zovem se Miki",
            "Moje ime je Miki"
        ],
        translation: {
            my: "moje",
            is: "je",
            miki: "Mickey (male name)"
        },
        xp: 5
    },
    {
        type: "translate",
        title: "Translate the following text:",
        text: "Odakle si?",
        acceptableAnswers: [
            "Where are you from",
            "Where are you from?"
        ],
        translation: {
            odakle: "Where ... from",
            si: "are you"
        },
        xp: 5
    }
];