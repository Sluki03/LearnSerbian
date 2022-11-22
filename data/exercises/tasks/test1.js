export const test1 = [
    /*{
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
                options: ["Zdravo! Kako si?", "Dobro jutro, sta ima?"],
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
                options: ["I ja.", "Ja ne."],
                translation: {
                    dobro: "good"
                }
            }
        ]
    },*/

    {
        type: "conversation",
        title: "Have a conversation.",
        participant: "Komsija Deki",
        mode: {
            type: "random",
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
                options: ["Oo, gde si ti covece, sta ima?", "Cek, ko je doktor?"],
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
                ],
                options: ["Ja sam direktor.", "Ja sam domar."]
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
        xp: 5,
        diacriticKeyboard: false
    },

    /*{
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
    }*/
];