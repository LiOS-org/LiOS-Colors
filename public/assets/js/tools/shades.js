import { liosOpen } from "../../../LiOS-Open/liosOpen.js";
import { palettesContainer, palettesContainerStateManager } from "../browse.js";
import { generatePalettes } from "../palettes.js";

export const initShades = async () => {
    const shadesFilterContainer = await liosOpen.virtualDom.new();
    shadesFilterContainer.select(".browse-shades-filter");
    shadesFilterContainer.classList("lios-card", "lios-frosted-glass");
    const resetButton = document.querySelector(".reset-pebble");

    const shadesFilter = await shadesFilterContainer.newChild();
    shadesFilter.classList("lios-cards-container", "shades-filter-buttons-container");
    const shadesBaseUrl = "https://data.colors.liosorg.com/shades/";
    const shadesMap = {
        "Violet": {
            "url": `${shadesBaseUrl}violet.json`,
            "color": "violet"
        },
        "Indigo": {
            "url": `${shadesBaseUrl}indigo.json`,
            "color": "indigo"
        },
        "Blue": {
            "url": `${shadesBaseUrl}blue.json`,
            "color": "blue"
        },
        "Green": {
            "url": `${shadesBaseUrl}green.json`,
            "color": "green"
        },
        "Yellow": {
            "url": `${shadesBaseUrl}yellow.json`,
            "color": "yellow"
        },
        "Orange": {
            "url": `${shadesBaseUrl}orange.json`,
            "color": "orange"
        },
        "Red": {
            "url": `${shadesBaseUrl}red.json`,
            "color": "red"
        },
        "White": {
            "url": `${shadesBaseUrl}white.json`,
            "color": "white"
         },
        "Black": {
            "url": `${shadesBaseUrl}black.json`,
            "color": "black"
         }
    };
    for (const shade in shadesMap) {
        const shadeName = shade;
        const shadeData = shadesMap[shadeName];
        const shadeColor = shadeData.color;
        const shadeUrl = shadeData.url;
        const colorDataFile = await fetch(shadeUrl);
        const colorData = await colorDataFile.json();

        const shadeButton = await shadesFilterContainer.newChild();
        shadeButton.attributes({
            style: `background:${shadeColor};`
        });
        shadeButton.classList("shades-filter-button", "lios-frosted-glass");
        palettesContainerStateManager.newState(shadeName);
        shadeButton.eventListner.add("click", async () => {
            palettesContainerStateManager.switchState(shadeName);

            await generatePalettes(colorData, "root");
            resetButton.style.display = "flex";

            palettesContainer.render();

        })
        shadeButton.appendTo(shadesFilter);
    }
    shadesFilter.classList("shades-filter-buttons-container");
    shadesFilter.appendTo("root");

    shadesFilterContainer.render();
};