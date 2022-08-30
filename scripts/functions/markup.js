export default function markup(string) {
    const markupCharacters = [
        { character: "**", regex: /\*\*/g, html: "b" },
        { character: "*", regex: /\*/g, html: "i" },
        { character: "__", regex: /_/g, html: "u" },
        { character: "--", regex: /-/g, html: "s" },
        { character: "####", regex: /####/g, html: "h4" },
        { character: "###", regex: /###/g, html: "h3" },
        { character: "##", regex: /##/g, html: "h2" },
        { character: "#", regex: /#/g, html: "h1" },
    ];

    let markupString = string;
    
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