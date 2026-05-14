import { metadata } from "./metadata.js";
import { liosOpen } from "../../LiOS-Open/liosOpen.js";
import { webUtils } from "../../LiOS-Web-Utils/liosWebUtils.js";
import { components } from "../../LiOS-Open/modules/JS/ui/components.js";
import {components as localComponents} from "../../extensions/components.js"
// Global Variables
const loader = document.querySelector(".hero-loader");
const scrollToTop = document.querySelector(".scroll-to-top-pebble");
let infiniteScrollLogic;
// 
// Main Function
const main = async () => {
    const colorShades = ["violet", "indigo", "blue", "green", "yellow", "orange", "red", "white", "black"]
    const colorData = [];
    let startingIndex = 0;
    let finalIndex = 25;
    let activeData = colorData;
    let activeStartingIndex = startingIndex;
    let activeFinalIndex = finalIndex
    const batch = 25;
    for (const shade of colorShades) {
        const data = webUtils.array.randomize(await fetch(`https://data.colors.liosorg.com/shades/${shade}.json`).then((response) => { return response.json() }));
        data.forEach((object) => {
            colorData.push(object)
        })
    }
    const ui = liosOpen.ui
    ui.extend("components", components);
    ui.extend("colors", localComponents);

    const main = new ui("main").style({
        "display": "flex",
        "flex-direction": "column",
        "align-items": "center",
        "gap": "15px"
    });
    // Shades Filters
    const shadesFilter = main.child("div").class.add("lios-card", "lios-frosted-glass").style({
        "background": "var(--frosted-color-2)",
        "border": "2px outset var(--frosted-color-2)",
        "width": "90%",
        "justify-self": "center"
    });
    // 
    const defaultView = main.child("div").class.add("lios-card-container").style({
        "gap": "15px",
        "justify-content": "center",
        "justify-self": "center"
    });

    let activeView = defaultView;

    const generatePalettes = (colorData) => {
        for (const palette of colorData) {
            activeView.colors().palette(palette.name, palette.hex)
        };
        activeStartingIndex += batch;
        activeFinalIndex += batch
    };
    generatePalettes(colorData.slice(0, finalIndex));

    // Infinite Scroll
    infiniteScrollLogic = async () => {
        const viewportHeight = window.innerHeight;
        const scrollHeight = document.documentElement.scrollHeight;

        if (window.scrollY + viewportHeight >= scrollHeight - 100) {
            window.removeEventListener("scroll", infiniteScrollLogic);

            loader.style.display = "flex";

            generatePalettes(activeData.slice(activeStartingIndex, activeFinalIndex));

            loader.style.display = "none";

            window.addEventListener("scroll", infiniteScrollLogic);
        };
    };
    window.addEventListener("scroll", infiniteScrollLogic);
    // 
    // Restore default 
    const restoreDefault = () => {
        activeView.style({
            "display": "none"
        });
        defaultView.style({
            "display": "flex"
        });
        activeData = colorData;
        activeStartingIndex = startingIndex;
        activeFinalIndex = finalIndex;
    }
    // 
    // Search 
    const searchView = main.child("div").class.add("lios-card-container").style({
        "display": "none",
        "justify-content": "center",
        "justify-self": "center"
    });
    const searchBar = document.querySelector(".search-bar.pebble");
    let searchData;
    searchBar.addEventListener("input", () => {
        const searchValue = searchBar.value;
        if (searchValue.length > 0 && activeView === defaultView) {
            // Backup default indexes
            startingIndex = activeStartingIndex;
            finalIndex = activeFinalIndex
            // 
        }
        activeStartingIndex = 0;
        activeFinalIndex = batch;
        searchData = []
        searchData = colorData.filter(color => {
            return color.name.toLowerCase().trim().includes(searchValue.toLowerCase().trim())
        });

        activeView = searchView
        activeData = searchData
        activeView.getElement().innerHTML = ""
        generatePalettes(activeData.slice(activeStartingIndex, activeFinalIndex));
        defaultView.style({
            "display": "none"
        });
        searchView.style({
            "display": "flex"
        })
        if (searchValue.length === 0) {
            restoreDefault()
        }
    });
    // 
};
// 
// Loader
const hideLoader = (async () => {

    await main();
    loader.style.display = "none";
});
// 
// Scroll To Top
window.addEventListener("scroll", () => {
    if (window.scrollY >= 1000) {
        scrollToTop.style.display = "flex";
    } else if (window.scrollY < 1000) {
        scrollToTop.style.display = "none";
    };
});
scrollToTop.addEventListener("click", () => {
    window.scroll({
        top: 0,
        behavior: "smooth",
    });
});
// 
await hideLoader();
// 
