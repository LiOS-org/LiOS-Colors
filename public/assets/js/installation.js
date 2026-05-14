const main = async () => {
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