export default function getPath() {
    let path = window.location.pathname.split("/");
    path = path[path.length - 1];
    path = path ? path.includes(".html") ? path.substring(0, path.length - 5) : path : "/";

    return path;
}