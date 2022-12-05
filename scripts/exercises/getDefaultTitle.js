import { defaultTitleData } from "../../data/exercises/defaultTitleData.js";

export default function getDefaultTitle(type) {
    let defaultTitle = "";
    
    Object.keys(defaultTitleData).forEach((taskType, index) => {
        if(type === taskType) defaultTitle = Object.values(defaultTitleData)[index];
    });

    return defaultTitle;
}