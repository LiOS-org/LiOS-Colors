import { colorConvertor } from "../assets/js/tools/colorConvertor.js";
import { webUtils } from "../LiOS-Web-Utils/liosWebUtils.js";
export const components = {
    method: function () {
        this.paletteButton = function (value) {
            const button = this.child("div").class.add("palettes-button");
            const element = button.getElement();
            element.innerHTML = `
                <div class="palettes-color-value"><span>${value}</span></div>
                <div class="palettes-copy-button copy-hex" title="Copy Hex"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-clipboard-icon lucide-clipboard"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/></svg></div>
                `
            button.on("click", () => {
                webUtils.text.copy(value);
                element.innerHTML = `
                <div class="palettes-color-value"><span>${value}</span></div>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-clipboard-check-icon lucide-clipboard-check"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m9 14 2 2 4-4"/></svg>
                `
                setTimeout(() => {
                    element.innerHTML = `
                    <div class="palettes-color-value"><span>${value}</span></div>
                    <div class="palettes-copy-button copy-hex" title="Copy Hex"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-clipboard-icon lucide-clipboard"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/></svg></div>
                    `
                },500)
            })
            return button;
        }
        this.palette = function (name, hex) {
            const hsl = colorConvertor.hsl(hex).toString();
            const srgb = colorConvertor.srgb(hex).toString();
            const oklch = colorConvertor.oklch(hex).toString();
            const translucentColor = `var(${hex.replace("#", "--")})`;

            const palette = this.child("div").class.add("color-palette", "lios-frosted-glass", "lios-card");
            const colorCard = palette.child("div").class.add("palette-color").style({
                "background": hex,
                "border": `2px inset ${hex}`
            });
            const colorName = palette.child("div").class.add("lios-card-title").child("span").text(name);

            const buttonsContainer = palette.child("div").class.add("palettes-button-container")
            buttonsContainer.colors().paletteButton(hex);
            buttonsContainer.colors().paletteButton(`hsl(${hsl})`);
            buttonsContainer.colors().paletteButton(`srgb(${srgb})`);
            buttonsContainer.colors().paletteButton(`oklch(${oklch})`);
            buttonsContainer.colors().paletteButton(translucentColor);
            
            return palette;
        }
        this.shadeButton = function (value) {
            const button = this.child("div").style({
                "display": "inline-flex",
                "width": "50px",
                "height": "50px",
                "border-width": "2px",
                "border-style": "inset",
                "background": value,
                "border-radius": "100vh",
                "cursor": "pointer"
            }).class.add("shades-button");
            button.on("click", () => {
                button.parent().getElement().querySelectorAll(".active").forEach((button) => {
                    button.classList.remove("active")
                })
                if (!button.getElement().classList.contains("active")) {
                    button.class.add("active");
                }
            });
            return button;
        }
        return this;
    },
    metadata: {
        name: "Components for LiOS-Colors",
        version: "1.0.0",
        versionCode: 1,
        api: {
            min: 1,
            max: 2
        },
        capabilities: {
            addsMethods: true,
            overridesMethods: false,
            addsProperties: true
        }
    }
};