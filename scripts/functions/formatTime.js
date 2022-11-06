export default function formatTime(specificTime) {
    const validTime = specificTime ? new Date(specificTime) : new Date();

    const minutes = "0" + validTime.getMinutes();
    const seconds = "0" + validTime.getSeconds();

    return `${minutes.substr(-2)}:${seconds.substr(-2)}`
}