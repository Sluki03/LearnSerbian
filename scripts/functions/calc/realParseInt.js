export default function realParseInt(number) {
    let result = number;
    
    const intNumber = parseInt(number);
    const difference = number - intNumber;

    if(difference >= 0.5) result += 1;
    return parseInt(result);
}