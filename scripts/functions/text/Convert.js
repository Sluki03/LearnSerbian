export const Convert = { jsToCssStandard, cssToJsStandard };

function jsToCssStandard(string) {
    let newString = "";

    for(let i = 0; i < string.length; i++) {
        if(string[i] === string[i].toUpperCase()) newString += `-${string[i].toLowerCase()}`;
        else newString += string[i];
    }

    return newString;
}

function cssToJsStandard(string) {
    let newString = "";
    let upperCaseStatus = false;

    for(let i = 0; i < string.length; i++) {
        if(upperCaseStatus) {
            upperCaseStatus = false;
            newString += string[i].toUpperCase();
        }

        else if(string[i] === "-") upperCaseStatus = true;
        else newString += string[i];
    }

    return newString;
}