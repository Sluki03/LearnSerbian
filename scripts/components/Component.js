// Index
import PanelsList from "./list/index/PanelsList.js";

// Lessons
import LessonsList from "./list/lessons/LessonsList.js";
import LessonModal from "./list/lessons/LessonModal.js";

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
import oneSplit from "../functions/text/oneSplit.js";

const components = {
    PanelsList, LessonsList, LessonModal, ExercisesList, ExerciseStats,
    ExerciseModal, ExerciseModalTask, ExerciseModalFinished, ExerciseModalReview, ExercisesStats,
    OptionImage, ConversationHolder, Loading, Nav, Footer,
    InteractiveTitle, Typing, DiacriticKeyboard, Scrollbar, StatisticProgressBar,
    ArrowButton, SpeakButton, ModalOptions, MoveModal, MiniModal,
    ClassicModal, Notes, NotesDashboard, NoteModal, NoteModalForm,
    NoteModalView, NoteOptionsModal, NoteIconModal
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
            switch(value) {
                case "true":
                case "false":
                    return value === "true" ? true : false;

                default:
                    const HTMLPPValue = renderHTMLPPFunction();
                    return HTMLPPValue;
            }

            function renderHTMLPPFunction() {
                const HTMLPPFunctions = ["js", "select"];
                let HTMLPPFunction = null;
                
                if(value.indexOf("htmlpp.") > -1) HTMLPPFunction = value.split("htmlpp.")[1];
                else return value;

                let functionExistence = false;

                HTMLPPFunctions.forEach(f => {
                    if(HTMLPPFunction.indexOf(f + "(") > -1) functionExistence = true;
                });

                if(!functionExistence) return value;

                const [name, params] = oneSplit(HTMLPPFunction, "(");
                const functionProps = { name, params: params.substring(0, params.length - 1) };

                switch(functionProps.name) {
                    case "js": return eval(functionProps.params);
                    case "select": return document.querySelector(functionProps.params);
                    
                    default: ;
                }
            }
        }
    });
}