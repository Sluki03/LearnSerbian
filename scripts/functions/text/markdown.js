export default function markdown(string) {
    const markdownCharacters = [
        { character: "**", regex: /\*\*/g, html: "b" },
        { character: "*", regex: /\*/g, html: "i" },
        { character: "__", regex: /_/g, html: "u" },
        { character: "--", regex: /-/g, html: "s" },
        { character: "####", regex: /####/g, html: "h4" },
        { character: "###", regex: /###/g, html: "h3" },
        { character: "##", regex: /##/g, html: "h2" },
        { character: "#", regex: /#/g, html: "h1" },
    ];

    let markdownString = string;
    
    markdownCharacters.forEach(convertObject => {
        const allCharacters = [...markdownString.matchAll(convertObject.regex)] || [];
        const convertLast = allCharacters.length % 2 === 0;
        let isClosingTag = false;

        for(let i = 0; i < allCharacters.length; i++) {
            if(allCharacters.length - 1 > i || convertLast) {
                const htmlTag = !isClosingTag ? `<${convertObject.html}>` : `</${convertObject.html}>`;
                markdownString = markdownString.replace(convertObject.character, htmlTag);

                isClosingTag = !isClosingTag;
            }
        }
    });

    return markdownString;
}