export default function getVisiblePlaceholder(input, placeholderSource) {
    let placeholder = "";

    const validPlaceholder = placeholderSource ? placeholderSource : input.placeholder;
    input.value = validPlaceholder;

    if(input.scrollWidth > input.clientWidth) {
        while(input.scrollWidth > input.clientWidth) input.value = input.value.substring(0, input.value.length - 1);
        placeholder = input.value.substring(0, input.value.length - 3);
    }

    else placeholder = input.placeholder;

    input.value = "";
    input.placeholder = `${placeholder}${input.scrollWidth > input.clientWidth ? "..." : ""}`;
    console.log(placeholderSource)
}