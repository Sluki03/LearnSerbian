import createElement from "../../../functions/element/createElement.js";
import loadLessons from "../../../lessons/loadLessons.js";

export default function LessonsList(componentProps) {
    const { builtIn } = componentProps;
    const { appendTo } = componentProps.params;

    const lessonsList = builtIn ? builtIn : createElement({
        tag: "div",
        attributes: { class: "lessons-list" },
        appendTo
    });

    loadLessons();

    return lessonsList;
}