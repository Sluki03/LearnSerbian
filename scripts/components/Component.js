// Index
import PanelsList from "./list/index/PanelsList.js";

// Lessons
import LessonsList from "./list/lessons/LessonsList.js";

// Exercises
import ExercisesList from "./list/exercises/ExercisesList.js";
import ExerciseStats from "./list/exercises/ExerciseStats.js";
import ExerciseModal from "./list/exercises/ExerciseModal.js";
import ExerciseModalTask from "./list/exercises/ExerciseModalTask.js";
import ExerciseModalFinished from "./list/exercises/ExerciseModalFinished.js";
import ExerciseModalReview from "./list/exercises/ExerciseModalReview.js";
import ExercisesStats from "./list/exercises/ExercisesStats.js";
import OptionImage from "./list/exercises/OptionImage.js";
import ConversationHolder from "./list/exercises/ConversationHolder.js";

// Other
import Loading from "./list/other/Loading.js";
import Nav from "./list/other/Nav.js"
import Footer from "./list/other/Footer.js";
import InteractiveTitle from "./list/other/InteractiveTitle.js"
import Typing from "./list/other/Typing.js";
import DiacriticKeyboard from "./list/other/DiacriticKeyboard.js";
import Scrollbar from "./list/other/Scrollbar.js";
import StatisticProgressBar from "./list/other/StatisticProgressBar.js";
import ArrowButton from "./list/other/buttons/ArrowButton.js";
import SpeakButton from "./list/other/buttons/SpeakButton.js";
import ModalOptions from "./list/other/modal/ModalOptions.js";
import MoveModal from "./list/other/modal/MoveModal.js";
import MiniModal from "./list/other/modal/MiniModal.js";
import ClassicModal from "./list/other/modal/ClassicModal.js";
import Notes from "./list/other/notes/Notes.js";
import NotesDashboard from "./list/other/notes/NotesDashboard.js";
import NoteModal from "./list/other/notes/NoteModal.js";
import NoteModalForm from "./list/other/notes/NoteModalForm.js";
import NoteModalView from "./list/other/notes/NoteModalView.js";
import NoteOptionsModal from "./list/other/notes/NoteOptionsModal.js";
import NoteIconModal from "./list/other/notes/NoteIconModal.js";

import { Convert } from "../functions/text/Convert.js";
import { buildEventList } from "../functions/other/EventControl.js";

const components = {
    PanelsList, LessonsList, ExercisesList, ExerciseStats, ExerciseModal,
    ExerciseModalTask, ExerciseModalFinished, ExerciseModalReview, ExercisesStats, OptionImage,
    ConversationHolder, Loading, Nav, Footer, InteractiveTitle,
    Typing, DiacriticKeyboard, Scrollbar, StatisticProgressBar, ArrowButton,
    SpeakButton, ModalOptions, MoveModal, MiniModal, ClassicModal,
    Notes, NotesDashboard, NoteModal, NoteModalForm, NoteModalView,
    NoteOptionsModal, NoteIconModal
};

export const Component = { create, render };

function create(componentName, params) {
    let componentInfo;

    Object.keys(components).forEach((component, index) => {
        if(componentName === component) componentInfo = {
            name: component,
            function: Object.values(components)[index]
        };
    });

    const componentProps = { builtIn: null, params };
    const newComponent = componentInfo.function(componentProps);
    
    newComponent.component = { name: componentInfo.name, params };
    buildEventList(newComponent);

    return newComponent;
}

function render(element) {
    const selectIn = element ? element : document;
    
    const componentElements = selectIn.querySelectorAll("[data-component]");
    const componentTypes = [];

    for(let i = 0; i < componentElements.length; i++) {
        const componentType = Convert.cssToJsStandard(componentElements[i].dataset.component);
        const validComponentType = componentType[0].toUpperCase() + componentType.substring(1);

        componentTypes.push(validComponentType);
    }

    componentTypes.forEach((componentType, index) => {
        let componentInfo;
        
        Object.keys(components).forEach((component, componentIndex) => {
            if(componentType === component) componentInfo = {
                name: component,
                function: Object.values(components)[componentIndex]
            };
        });
        
        const { dataset } = componentElements[index];
        let validDataset = {};

        Object.keys(dataset).forEach((key, index) => {
            if(key === "component") return;
            validDataset = {...validDataset, [key]: convertDatasetValue(Object.values(dataset)[index])};
        });

        const componentProps = { builtIn: componentElements[index], params: validDataset };

        const newComponent = componentInfo.function(componentProps);
        
        newComponent.component = { name: componentInfo.name, params: validDataset };
        buildEventList(newComponent);

        function convertDatasetValue(value) {
            let element = "";
            
            if(value.indexOf("select(") > -1) {
                const selectedElement = value.split("select(")[1];
                element = selectedElement.substring(0, selectedElement.length - 1);
            }
            
            switch(value) {
                case "true":
                case "false":
                    return value === "true" ? true : false;
                case `select(${element})`: return document.querySelector(element);

                default: return value;
            }
        }
    });
}