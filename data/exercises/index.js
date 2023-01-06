import { newWords } from "./tasks/newWords.js";
import { test1 } from "./tasks/test1.js";
import { hearing } from "./tasks/hearing.js";

// difficulty options: easy, medium, hard
// task types: multipleChoice, multipleChoiceOfImage, multipleChoiceImages, translate, conversation, connect, completeText, listen
// translate modes: write (default), wordBank
// conversation modes: write (default), multipleChoice

export const exercisesData = [
    {
        name: "New words",
        difficulty: "easy",
        icon: "./images/exercises/cat.png",
        tasks: newWords,
        numberOfTasks: 5,
        lives: 3,
        defaultXP: 10
    },

    {
        name: "Test 1",
        difficulty: "hard",
        tasks: test1,
        lives: 5
    },

    {
        name: "Hearing",
        difficulty: "medium",
        tasks: hearing,
        //lives: 2
    }
];