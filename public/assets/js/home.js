import { generatePalettes } from "./tools/generatePalettes.js"
import { liosGetRandomItems } from "../../LiOS-Web-Utils/liosWebUtils.js";

const main = async () => {
    const colorsFile = await fetch("./data/colornames.json");
    const colorsData = await colorsFile.json();

    generatePalettes(liosGetRandomItems(colorsData, 10), document.querySelector(".home-color-showcase-1"));
    generatePalettes(liosGetRandomItems(colorsData, 10), document.querySelector(".home-color-showcase-2"));

    // Smooth infinite marquee-style carousel
    const autoCarousel = (track, speed = 0.35, direction) => {
        let offset = 0;
        let paused = false;

        // duplicate content for seamless looping
        const children = Array.from(track.children);

        children.forEach(child => {
            const clone = child.cloneNode(true); // deep clone
            track.appendChild(clone);
        });

        const slides = Array.from(track.children);
        let totalWidth = 0;

        slides.forEach(slide => {
            totalWidth += slide.offsetWidth + 5;
            slide.data
        });

        const halfWidth = totalWidth / 2;

        const step = () => {
            if (!paused) {
                if (direction === "reversed") {
                    // decrement the offset modulo halfWidth so it moves left-to-right smoothly
                    offset = (offset - speed) % halfWidth;
                    if (offset < 0) offset += halfWidth;
                } else {
                    // increment and wrap for normal direction
                    offset = (offset + speed) % halfWidth;
                }
            };

            // use negative translate in both cases to keep duplicated content alignment
            track.style.transform = `translateX(${-offset}px)`;

            requestAnimationFrame(step);
        };
        track.addEventListener("mouseenter", () => {
            paused = true;
        });
        track.addEventListener("mouseleave", () => {
            paused = false;
        });

        requestAnimationFrame(step);
    };

    autoCarousel(document.querySelector(".home-color-showcase-1"), 0.35);
    autoCarousel(document.querySelector(".home-color-showcase-2"), 0.35, "reversed");
    // 
    // Add copy to clipboard functionality to code snippets
    const codeSnippets = document.querySelectorAll(".copyable-code");
    codeSnippets.forEach(snippet => {
        const code = snippet.querySelector("code").innerText;
        const copyButton = snippet.querySelector(".copy-button");
        copyButton.addEventListener("click", async () => {
            navigator.clipboard.writeText(code);

            const saveSVG = copyButton.innerHTML;
            copyButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-clipboard-check-icon lucide-clipboard-check"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m9 14 2 2 4-4"/></svg>`;
            setTimeout(() => {
                copyButton.innerHTML = saveSVG;
            }, 1000)
        });
    });
    // 
};

const hideLoader = (async () => {
    const loader = document.querySelector(".hero-loader");

    await main();

    loader.parentElement.removeChild(loader);
})();