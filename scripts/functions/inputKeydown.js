export default function inputKeydown(e) {
    const inputTags = ["input", "textarea"];
    
    if(inputTags.indexOf(e.target.nodeName.toLowerCase()) > -1) return true;
    return false;
}