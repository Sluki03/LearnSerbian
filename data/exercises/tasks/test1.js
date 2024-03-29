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
                    "Ćao! Kako si?"
                ],
                options: ["Zdravo! Kako si?", "Dobro jutro, šta ima?"],
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
    },

    {
        type: "conversation",
        title: "Have a conversation.",
        participant: "Komšija Deki",
        mode: {
            type: "random",
            switch: true
        },
        messages: [
            {
                content: "Šta ima doktore?",
                userContent: "Oh, where are you man, what's up?",
                acceptableAnswers: [
                    "Oo, gde si ti covece, sta ima?",
                    "O, pa gde si ti čoveče, šta ima?"
                ],
                options: ["Oo, gde si ti čovece, šta ima?", "Ček, ko je doktor?"],
                translation: {
                    šta: "what",
                    doktore: "doctor"
                }
            },

            {
                content: "Na kojoj poziciji u firmi radiš sada?",
                userContent: "I am a CEO.",
                acceptableAnswers: [
                    "Ja sam direktor.",
                    "Ja sam CEO.",
                    "Ja sam generalni izvršni direktor."
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
        diacriticKeyboard: false,
        speak: true
    },

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
    },*/

    {
        type: "listen",
        title: "Enter what you hear.",
        text: "Na traci je Simi.",
        acceptableAnswers: ["Simi is on the track."],
        translation: {
            traci: "track"
        }
    }
];