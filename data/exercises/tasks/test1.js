export const test1 = [
    {
        type: "conversation",
        title: "Have a conversation.",
        participant: "Gospodin",
        mode: {
            type: "write",
            switch: true
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
    },

    {
        type: "conversation",
        title: "Have a conversation.",
        participant: "Komsija Deki",
        mode: {
            type: "write",
            switch: true
        },
        messages: [
            {
                content: "Sta ima doktore?",
                userContent: "Oh, where are you man, what's up?",
                acceptableAnswers: [
                    "Oo, gde si ti covece, sta ima?",
                    "O, pa gde si ti covece, sta ima?"
                ],
                translation: {
                    sta: "what",
                    doktore: "doctor"
                }
            },

            {
                content: "Na kojoj poziciji u firmi radis sada?",
                userContent: "I am a CEO.",
                acceptableAnswers: [
                    "Ja sam direktor.",
                    "Ja sam CEO.",
                    "Ja sam generalni izvrsi direktor."
                ]
            }
        ]
    }
];