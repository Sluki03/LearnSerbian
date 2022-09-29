export const test1 = [
    {
        type: "conversation",
        title: "Have a conversation.",
        participant: "Gospodin",
        mode: {
            type: "write",
            switch: false
        },
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
                    "I ja sam.",
                    "I ja takodje."
                ],
                translation: {
                    zdravo: "hello"
                }
            }
        ]
    }
];