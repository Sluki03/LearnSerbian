import { Component } from "../../Component.js";
import markup from "../../../functions/markup.js";
import { Styles } from "../../../functions/Styles.js";
import realParseInt from "../../../functions/realParseInt.js";

export default function ExerciseModalContent(componentProps) {
    const { exercise, appendTo, style, titleStyle, buttonStyle } = componentProps.params;

    Component.create("ExerciseModalTask", { exercise, appendTo });
}
