export default function getBorderRadius(lastRadius) {
    const validRadius = [
        "30% 70% 70% 30% / 55% 56% 44% 45%", "30% 70% 36% 64% / 55% 27% 73% 45%", "47% 53% 36% 64% / 31% 27% 73% 69%",
        "47% 53% 76% 24% / 31% 27% 73% 69%", "47% 53% 76% 24% / 31% 71% 29% 69%", "75% 25% 76% 24% / 31% 71% 29% 69%"
    ];

    let randomRadius = validRadius[Math.floor(Math.random() * validRadius.length)];
    if(lastRadius !== null) while(randomRadius === lastRadius) randomRadius = validRadius[Math.floor(Math.random() * validRadius.length)];

    return randomRadius;
}