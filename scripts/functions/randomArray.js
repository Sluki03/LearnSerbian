export default function randomArray(array) {
    const newArray = [];

    const randomIndexes = [];
    let randomIndex = Math.floor(Math.random() * array.length);

    for(let i = 0; i < array.length; i++) {
        while(randomIndexes.indexOf(randomIndex) !== -1) randomIndex = Math.floor(Math.random() * array.length);
        randomIndexes.push(randomIndex);
    }

    for(let i = 0; i < randomIndexes.length; i++) newArray.push(array[randomIndexes[i]]);

    return newArray;
}