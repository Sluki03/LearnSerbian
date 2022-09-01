export default function getDifficultyColor(difficulty) {
    const colors = { easy: "#07db2d", medium: "#ffe603", hard: "#d91435" };
    let selectedColor = "";

    Object.keys(colors).forEach((key, index) => {
        if(key === difficulty) selectedColor = Object.values(colors)[index];
    });

    return selectedColor;
}