export default function shortenPlaceholder(input, placeholderSrc) {
    let placeholder = "";
    let dots = false;

    const validPlaceholder = placeholderSrc ? placeholderSrc : input.placeholder;
    input.value = validPlaceholder;

    if(input.scrollWidth > input.clientWidth) {
        dots = true;
        
        while(input.scrollWidth > input.clientWidth) input.value = input.value.substring(0, input.value.length - 1);
        placeholder = input.value.substring(0, input.value.length - 3);
    }

    else placeholder = validPlaceholder;

    input.value = "";
    input.placeholder = `${placeholder}${dots ? "..." : ""}`;
}