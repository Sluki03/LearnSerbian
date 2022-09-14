export const test1 = [
    {
        type: "multipleChoiceImages",
        title: "Translate the word \"dog\".",
        acceptableAnswers: ["pas"],
        options: ["macka", "pas", "ptica", "zec"],
        images: {
            macka: "../../images/exercises/cat.png",
            pas: "../../images/exercises/dog.png",
            ptica: "../../images/exercises/bird.png",
            zec: "../../images/exercises/rabbit.png"
        },
        xp: 5,
        explanation: `
            **Pas** is a **dog**.
        `
    },

    {
        type: "translate",
        title: "Translate the following text:",
        text: "My name is Miki",
        acceptableAnswers: [
            "Ja se zovem Miki",
            "Zovem se Miki",
            "Moje ime je Miki"
        ],
        xp: 20
    }
];