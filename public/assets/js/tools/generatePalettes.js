import { liosCopyText } from "../../../LiOS-Web-Utils/liosWebUtils.js";
import Color from "https://colorjs.io/dist/color.js";
import { colorConvertor } from "./colorConvertor.js";

export const generatePalettes = (data, parent) => {
    // Verify data is an array
    if (!Array.isArray(data)) {
        console.error("Data must be an array");
        return;
    };
    // Verify parent is a DOM Element
    if (!(parent instanceof HTMLElement)) {
        console.error("Parent must be a DOM Element")
        return;
    };
    data.forEach(pallete => {
        const name = pallete.name;
        const hex = pallete.hex;
        const hsl = colorConvertor.hsl(hex).toString();
        const srgb = colorConvertor.srgb(hex).toString();
        const oklch = colorConvertor.oklch(hex).toString();
        const translucentColor = `var(${hex.replace("#", "--")})`;

        const colorPalette = document.createElement("div");
        colorPalette.classList.add("lios-card", "color-palette", "lios-frosted-glass");

        colorPalette.innerHTML = //html
            `
            <div class = "palette-color" style="background:${hex};border: 2px inset ${hex};"></div>
            <br>
            <div class = "lios-card-title"><span>${name}</span></div>
            <br>
            <div class="palettes-button-container">
                <div class="palettes-button lios-frosted-glass  palette-hex">
                    <div class="palettes-color-value"><span>${hex}</span></div>
                    <div class="palettes-copy-button copy-hex" title="Copy Hex"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-clipboard-icon lucide-clipboard"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/></svg></div>
                </div>
                <div class="palettes-button lios-frosted-glass  palette-translucent-color">
                    <div class="palettes-color-value"><span>${translucentColor}</span></div>
                    <div class="palettes-copy-button copy-translucent-color" title="Copy as translucent color"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-clipboard-icon lucide-clipboard"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/></svg></div>
                </div>
                <div class="palettes-button lios-frosted-glass  palette-hsl">
                    <div class="palettes-color-value"><span>hsl(${hsl})</span></div>
                    <div class="palettes-copy-button copy-hsl" title="Copy hsl"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-clipboard-icon lucide-clipboard"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/></svg></div>
                </div>
                <div class="palettes-button lios-frosted-glass  palette-srgb">
                    <div class="palettes-color-value"><span>rgb(${srgb})</span></div>
                    <div class="palettes-copy-button copy-srgb" title="Copy srgb"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-clipboard-icon lucide-clipboard"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/></svg></div>
                </div>
                <div class="palettes-button lios-frosted-glass  palette-oklch">
                    <div class="palettes-color-value"><span>oklch(${oklch})</span></div>
                    <div class="palettes-copy-button copy-translucent-color" title="Copy oklch"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-clipboard-icon lucide-clipboard"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/></svg></div>
                </div>
            </div>
        `;
        palettesAddButtons(colorPalette, hex, translucentColor, hsl, srgb, oklch);
        parent.appendChild(colorPalette);
    });
};
export const containerAddButtons = (container) => {
    const palettes = container.querySelectorAll(".color-palette");
    palettes.forEach((palette) => {
        const copyBlock = palette.querySelector(".palettes-button-container");
        const hex = copyBlock.querySelector(".palette-hex .palettes-color-value span").innerText;
        const translucentColor = copyBlock.querySelector(".palette-translucent-color .palettes-color-value span").innerText;
        palettesAddButtons(palette, hex, translucentColor, hsl, srgb, oklch);
    });
};
export const palettesAddButtons = (palette, hex, translucentColor, hsl, srgb, oklch) => {
    // Copy Hex
    const hexButton = palette.querySelector(".palettes-button.palette-hex");
    hexButton.addEventListener("click", async () => {
        const saveSVG = hexButton.querySelector(".palettes-copy-button").innerHTML;
        await liosCopyText(hex);
        hexButton.querySelector(".palettes-copy-button").innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-clipboard-check-icon lucide-clipboard-check"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m9 14 2 2 4-4"/></svg>`;
        setTimeout(() => {
            hexButton.querySelector(".palettes-copy-button").innerHTML = saveSVG;
        }, 500)
    });
    //
    // Copy translucent color
    const translucentColorButton = palette.querySelector(".palettes-button.palette-translucent-color");
    translucentColorButton.addEventListener("click", async () => {
        const saveSVG = translucentColorButton.querySelector(".palettes-copy-button").innerHTML;
        await liosCopyText(translucentColor);
        translucentColorButton.querySelector(".palettes-copy-button").innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-clipboard-check-icon lucide-clipboard-check"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m9 14 2 2 4-4"/></svg>`;
        setTimeout(() => {
            translucentColorButton.querySelector(".palettes-copy-button").innerHTML = saveSVG;
        }, 500)
    });
    //
    // Copy HSL
    const hslButton = palette.querySelector(".palettes-button.palette-hsl");
    hslButton.addEventListener("click", async () => {
        const saveSVG = hslButton.querySelector(".palettes-copy-button").innerHTML;
        await liosCopyText(hsl);
        hslButton.querySelector(".palettes-copy-button").innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-clipboard-check-icon lucide-clipboard-check"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m9 14 2 2 4-4"/></svg>`;
        setTimeout(() => {
            hslButton.querySelector(".palettes-copy-button").innerHTML = saveSVG;
        }, 500)
    });
    //
    // Copy sRGB
    const srgbButton = palette.querySelector(".palettes-button.palette-srgb");
    srgbButton.addEventListener("click", async () => {
        const saveSVG = srgbButton.querySelector(".palettes-copy-button").innerHTML;
        await liosCopyText(srgb);
        srgbButton.querySelector(".palettes-copy-button").innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-clipboard-check-icon lucide-clipboard-check"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m9 14 2 2 4-4"/></svg>`;
        setTimeout(() => {
            srgbButton.querySelector(".palettes-copy-button").innerHTML = saveSVG;
        }, 500)
    });
    //
    // Copy oklch
    const oklchButton = palette.querySelector(".palettes-button.palette-oklch");
    oklchButton.addEventListener("click", async () => {
        const saveSVG = oklchButton.querySelector(".palettes-copy-button").innerHTML;
        await liosCopyText(oklch);
        oklchButton.querySelector(".palettes-copy-button").innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-clipboard-check-icon lucide-clipboard-check"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m9 14 2 2 4-4"/></svg>`;
        setTimeout(() => {
            oklchButton.querySelector(".palettes-copy-button").innerHTML = saveSVG;
        }, 500)
    });
    //
};