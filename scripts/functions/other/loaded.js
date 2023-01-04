export default function loaded() {
    const loading = document.querySelectorAll(".loading");
    
    for(let i = 0; i < loading.length; i++) loading[i].style.opacity = "0";

    setTimeout(() => {
        for(let i = 0; i < loading.length; i++) loading[i].remove();

        const body = document.querySelector("body");
        body.style.overflow = "visible";
    }, 300);
}