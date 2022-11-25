export default function getRotateValue(element) {
    const matrix = getComputedStyle(element).getPropertyValue("transform");
    
    let matrixValues = matrix.split("matrix(")[1].split(",");
    matrixValues[matrixValues.length - 1] = matrixValues[matrixValues.length - 1].substring(-1);
    matrixValues.forEach((matrixValue, index) => { matrixValues[index] = parseFloat(matrixValue) });
    
    const angle = Math.round(Math.asin(matrixValues[1]) * (180 / Math.PI));
    return angle;
}