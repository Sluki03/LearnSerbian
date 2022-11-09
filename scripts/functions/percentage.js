export const Percentage = { calc, of };

function calc(total, part) {
    const calcPercentage = 100 * part / total;
    return parseFloat(calcPercentage.toFixed(2));
}

function of(number, percentage) {
    const ofPercentage = number / 100 * percentage;
    return parseFloat(ofPercentage.toFixed(2));
}