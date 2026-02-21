import { webUtils } from "../../LiOS-Web-Utils/liosWebUtils.js";
import { fragments as fragmentFile,palettesContainer } from "./browse.js";

export const generatePalettes = async (colorData,location) => {
    for (const palette of colorData) {
        const card = await palettesContainer.newChild();
        card.classList("lios-card", "lios-frosted-glass", "color-palette");
        const hex = palette.hex;
        const name = palette.name;

        const paletteColor = await palettesContainer.newChild();
        paletteColor.classList("palette-color");
        paletteColor.attributes({
            style:
                `background: ${hex};
                    border: 2px inset ${hex}`
                
        });
        paletteColor.appendTo(card);

        const title = await palettesContainer.newChild();
        title.classList("lios-card-title");
        const titleText = await palettesContainer.newChild("span");
        titleText.textContent(name);
        titleText.appendTo(title);
        title.appendTo(card);

            
            
        card.appendTo(location);
    };
};