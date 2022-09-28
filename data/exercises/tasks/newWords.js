export const newWords = [
    {
        type: "multipleChoice",
        title: "How to say \"color\" in Serbian?",
        acceptableAnswers: ["boja"],
        options: ["čemu", "to", "nešto", "boja"],
        xp: 5,
        explanation: `
            #Reason#
            Why the answer is: **boja**?<br />
            Well, the reason is *simple*, that is how we say \"color\" in Serbian language...
        `
    },

    {
        type: "multipleChoice",
        title: "How to say \"dog\" in Serbian?",
        acceptableAnswers: ["pas"],
        options: ["ae", "videćemo", "pas", "jako"],
        xp: 2
    },

    {
        type: "multipleChoice",
        title: "What is the translation of \"čemu to\"?",
        acceptableAnswers: ["why that"],
        options: ["why that", "I don't know", "maybe", "tomorrow"],
        xp: 1
    },

    {
        type: "multipleChoice",
        title: "What is the translation of \"najjače\"?",
        acceptableAnswers: ["the strongest"],
        options: ["why that", "wow", "the strongest", "okay"]
    },

    {
        type: "multipleChoice",
        title: "What is the translation of \"ae videćemo\"?",
        acceptableAnswers: ["we'll see"],
        options: ["we'll see", "for real", "sure", "hello"]
    },

    {
        type: "multipleChoice",
        title: "How to say \"ice cream\" in Serbian?",
        acceptableAnswers: ["sladoled"],
        options: ["ae", "sladoled", "pas", "jako"]
    },

    {
        type: "multipleChoice",
        title: "How to say \"I don't know\" in Serbian?",
        acceptableAnswers: ["ne znam"],
        options: ["ne znam", "znam", "haha", "šta znam"]
    },

    {
        type: "multipleChoice",
        title: "How to say \"T-Shirt\" in Serbian?",
        acceptableAnswers: ["majica"],
        options: ["majica", "odelo", "pas", "krokodil"]
    },

    {
        type: "multipleChoiceImages",
        title: "Translate the word \"dog\".",
        acceptableAnswers: ["pas"],
        options: ["macka", "pas", "ptica", "zec"],
        images: {
            macka: "./images/exercises/cat.png",
            pas: "./images/exercises/dog.png",
            ptica: "./images/exercises/bird.png",
            zec: "./images/exercises/rabbit.png"
        },
        xp: 15,
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
        text: "Ja sam šef",
        acceptableAnswers: [
            "I am the boss",
            "I'm the boss"
        ],
        translation: {
            šef: "the boss"
        },
        xp: 5
    },

    {
        type: "translate",
        title: "Translate the following text:",
        text: "Odakle si?",
        mode: {
            type: "random",
            switch: true
        },
        options: ["where", "gang", "are", "who", "you", "from", "strong", "attitude"],
        acceptableAnswers: [
            "Where are you from"
        ],
        translation: {
            odakle: "Where ... from",
            si: "are you"
        },
        xp: 5
    }
];