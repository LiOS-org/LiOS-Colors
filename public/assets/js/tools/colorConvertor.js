import Color from "https://colorjs.io/dist/color.js";

export const colorConvertor = {
    hsl: (input) => {
        const [h, s, l] = new Color(input).hsl;
        return [Math.round(h), Math.round(s), Math.round(l)];
    },
    srgb: (input) => {
        const [r, g, b] = new Color(input).srgb;
        return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    },
    oklch: (input) => {
        const [l, c, h] = new Color(input).oklch;
        return [Math.round(l), Math.round(c), Math.round(h)];
    }
};