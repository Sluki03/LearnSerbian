const icons = ["./images/icons/notes-icon.png"];

const colors = ["red", "blue", "green", "yellow"];
colors.forEach(color => icons.push(`./images/icons/notes-${color}-icon.png`));

export const noteIconsData = icons;