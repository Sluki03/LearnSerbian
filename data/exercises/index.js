import { newWords } from "./tasks/newWords.js";
import { test1 } from "./tasks/test1.js";
import { hearing } from "./tasks/hearing.js";

// difficulty options: easy, medium, hard
// task types: multipleChoice, multipleChoiceImages, translate, conversation, connect, completeText
// translate modes: write (default), wordBank
// conversation modes: write (default), multipleChoice

export const exercisesData = [
    {
        name: "New words",
        difficulty: "easy",
        icon: "./images/exercises/cat.png",
        tips: `
            #This is pretty hard#
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.<br /><br />

            ##Important!##
            Nulla ut egestas nulla.<br />
            Curabitur maximus sem sit amet **placerat** rutrum. *Cras porttitor eros urna*, nec finibus<br />
            risus volutpat vitae. __Curabitur a laoreet orci, sit amet posuere mi__.<br />
            --Phasellus rutrum metus ac libero cursus consectetur--. Donec vitae semper ante, ut scelerisque lorem. Nam tempor placerat lorem, non tincidunt enim sollicitudin ut. Donec sed luctus erat. Vestibulum lacus ante, ultricies eu consectetur in, pulvinar eget sapien. Fusce nec felis justo. Integer varius arcu eget faucibus elementum. Morbi rutrum facilisis ornare. Nullam ac ex maximus, fringilla ligula eget, placerat lacus.<br /><br />

            ###Very important!###
            Duis volutpat mauris nisl. Donec efficitur oreet non in nunc. Sed nec urna at urna consequat consequat. Nam metus erat, tristique vitae pretium vitae, euismod nec nisl. Suspendisse potenti. Aliquam erat volutpat. Nam nisl velit, scelerisque a turpis non, vehicula maximus nibh. Nam viverra gravida condimentum. Nam ac metus laoreet, cursus nunc vel, pretium metus. Maecenas blandit sem dictum lacus molestie convallis. Fusce suscipit, tellus eget bibendum tempor, neque nunc fermentum ipsum, quis condimentum nunc nunc in felis.
        `,
        tasks: newWords,
        numberOfTasks: 5,
        lives: 2,
        defaultXP: 10
    },

    {
        name: "Test 1",
        difficulty: "hard",
        tips: "#Multiple choice images preview.#",
        tasks: test1,
        lives: 5
    },

    {
        name: "Hearing",
        difficulty: "medium",
        tips: "#Responsive Voice API#**This API has been successfully implemented into the all types of tasks!**",
        tasks: hearing,
        //lives: 2
    }
];