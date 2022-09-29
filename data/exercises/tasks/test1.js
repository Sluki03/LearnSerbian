export const test1 = [
    {
        type: "conversation",
        title: "Have a conversation.",
        participant: "John",
        messages: [
            {
                content: "Zdravo!",
                userContent: "Hello! How are you?",
                acceptableAnswers: [
                    "Zdravo! Kako si?",
                    "Cao! Kako si?"
                ],
                translation: {
                    zdravo: "hello"
                }
            },

            {
                content: "Dobro sam, a ti?",
                userContent: "Me too.",
                acceptableAnswers: [
                    "I ja.",
                    "I ja takodje."
                ],
                translation: {
                    zdravo: "hello"
                }
            }
        ]
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