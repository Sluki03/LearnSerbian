export default function oneSplit(string, target) {
    const array = [];
    let splitStatus = false;

    for(let i = 0; i < string.length; i++) {
        if(!splitStatus && (string[i] === target)) {
            splitStatus = true;
            
            array.push(string.substring(0, i));
            array.push(string.substring(i + 1, string.length));
        }
    }

    return array;
}