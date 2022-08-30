export default function markup(string) {
    const secureCharacters = [
        { html: "&", secure: "&amp;" },
        { html: "<", secure: "&lt;" },
        { html: ">", secure: "&gt;" },
        { html: '"', secure: "&quot;" },
        { html: "'", secure: "&#x27;" },
        { html: "/", secure: "&#47;" },
        { html: "\\", secure: "&#92;" }
    ];

    const markupCharacters = [
        { character: "**", regex: /\*\*/g, html: "b" },
        { character: "*", regex: /\*/g, html: "i" },
        { character: "_", regex: /_/g, html: "u" },
        { character: "-", regex: /-/g, html: "s" },
        { character: "#", regex: /#/g, html: "h1" },
        { character: "##", regex: /##/g, html: "h2" },
        { character: "###", regex: /###/g, html: "h3" },
    ];

    let markupString = string;

    for(let i = 0; i < secureCharacters.length; i++) markupString = markupString.replaceAll(secureCharacters[i].html, secureCharacters[i].secure);
    
    markupCharacters.forEach(convertObject => {
        const allCharacters = [...markupString.matchAll(convertObject.regex)] || [];
        const convertLast = allCharacters.length % 2 === 0;
        let isClosingTag = false;

        for(let i = 0; i < allCharacters.length; i++) {
            if(allCharacters.length - 1 > i || convertLast) {
                const htmlTag = !isClosingTag ? `<${convertObject.html}>` : `</${convertObject.html}>`;
                markupString = markupString.replace(convertObject.character, htmlTag);

                isClosingTag = !isClosingTag;
            }
        }
    });

    return markupString;
}