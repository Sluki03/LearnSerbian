export default function cancelLoading(type) {
    const loading = document.querySelector(type);
    loading.remove();
}