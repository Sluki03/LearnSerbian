const icons = ["./images/icons/notes-icon.png"];
const colors = ["red", "blue", "green", "yellow", "./images/icons/image-icon.png"];

colors.forEach((color, index) => {
    if(colors.length - 1 === index) icons.push(color);
    else icons.push(`./images/icons/notes-${color}-icon.png`);
});

export const noteIconsData = icons;