export const hearing = [
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
        `,
        speak: true
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
        `,
        speak: true
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
        speak: true
    },

    {
        type: "translate",
        title: "Translate the following text:",
        text: "What is your name?",
        mode: {
            type: "random",
            switch: true
        },
        options: ["Kako", "se", "zoveš"],
        acceptableAnswers: ["Kako se zoves", "Kako se zoveš", "Kako je tvoje ime"],
        translation: {
            What: "Šta? / Kako?",
            is: "je",
            your: "tvoje",
            name: "ime"
        },
        englishSerbian: true,
        speak: true
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
                    "O, pa gde si ti covece, sta ima?"
                ],
                options: ["Oo, gde si ti covece, sta ima?", "Cek, ko je doktor?"],
                translation: {
                    sta: "what",
                    doktore: "doctor"
                }
            },

            {
                content: "Na kojoj poziciji u firmi radiš sada?",
                userContent: "I am a CEO.",
                acceptableAnswers: [
                    "Ja sam direktor.",
                    "Ja sam CEO.",
                    "Ja sam generalni izvrsni direktor."
                ],
                options: ["Ja sam direktor.", "Ja sam domar."]
            }
        ],
        speak: true
    },

    {
        type: "connect",
        title: "Connect the right words.",
        options: { dog: "pas", cat: "mačka", president: "predsednik", killer: "ubica" },
        speak: true
    },

    {
        type: "completeText",
        title: "Complete the following sentence:",
        text: "Deste ljudi, sta ima, <how> ste? Evo, evo, mi smo <good>. Inace, ja se <to be called> Milorad i dolazim iz <belgrade>.",
        mode: {
            type: "write",
            switch: true
        },
        options: ["kako", "Beograda", "dobro", "zovem"],
        acceptableAnswers: { how: ["kako"], good: ["dobro", "okej"], toBeCalled: ["zovem"], belgrade: ["Beograda", "BGa"] },
        hints: {
            status: false,
            switch: true
        },
        speak: true
    }
]