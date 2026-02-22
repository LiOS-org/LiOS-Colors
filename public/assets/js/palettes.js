import { webUtils } from "../../LiOS-Web-Utils/liosWebUtils.js";
import { fragments as fragmentFile,palettesContainer } from "./browse.js";

export const generatePalettes = async (colorData, location) => {
    for (const palette of colorData) {
        const card = await palettesContainer.newChild();
        card.classList("lios-card", "lios-frosted-glass", "color-palette");
        const hex = palette.hex;
        const name = palette.name;

        const paletteColor = await palettesContainer.newChild();
        paletteColor.classList("palette-color");
        paletteColor.attributes(
            {
                style:
                    `background: ${hex};
                    border: 2px inset ${hex}`
                
            }
        );
        paletteColor.appendTo(card);

        const title = await palettesContainer.newChild();
        title.classList("lios-card-title");
        const titleText = await palettesContainer.newChild("span");
        titleText.textContent(name);
        titleText.appendTo(title);
        title.appendTo(card);

        const paletteButtonsContainer = await palettesContainer.newChild();
        paletteButtonsContainer.classList("palette-buttons-container");

        const hexButton = await palettesContainer.newChild();
        hexButton.classList("palettes-button", "lios-frosted-glass", "palette-hex");
        hexButton.eventListner.add("click", async (e) => {
            const element = e.currentTarget;
            const clipboard = element.querySelector(".clipboard-button svg")

            const clipboardDeactivated = clipboard;
            const parser = new DOMParser();
            const clipboardActivated = parser.parseFromString(`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-clipboard-check-icon lucide-clipboard-check"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m9 14 2 2 4-4"/></svg>`, "image/svg+xml");

            const clipboardActivatedElement = clipboardActivated.documentElement;

            clipboard.replaceWith(clipboardActivatedElement);

            webUtils.text.copy(hex);

            setTimeout(() => {
                clipboardActivatedElement.replaceWith(clipboardDeactivated);
            }, 1500);
        });
        
        const hexButtonText = await palettesContainer.newChild("span");
        hexButtonText.textContent(hex);

        const clipboardButton = await palettesContainer.newChild("span");
        clipboardButton.classList("clipboard-button");

        const clipboardIcon = await palettesContainer.svgParser(`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-clipboard-icon lucide-clipboard"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/></svg>`)
        
        hexButtonText.appendTo(hexButton);
        clipboardIcon.appendTo(clipboardButton);
        clipboardButton.appendTo(hexButton);
        hexButton.appendTo(paletteButtonsContainer);

        paletteButtonsContainer.appendTo(card);

            
            
        card.appendTo(location);
    };
};