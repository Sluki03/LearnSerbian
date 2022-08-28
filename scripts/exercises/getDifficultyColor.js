export default function getDifficultyColor(difficulty) {
    const colors = { easy: "#0fff03", medium: "#ffe603", hard: "#df1c3d" };
    let selectedColor = "";

    Object.keys(colors).forEach((key, index) => {
        if(key === difficulty) selectedColor = Object.values(colors)[index];
    });

    return selectedColor;
}