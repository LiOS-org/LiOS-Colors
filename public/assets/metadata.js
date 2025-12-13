/* eslint-disable no-undef */
const metadataPath = await fetch("./metadata.json");
const metadata = await metadataPath.json();

document.querySelector(".project-name").textContent = metadata.projectName;
document.querySelector(".project-version-release-notes").href =
  `${metadata.github}/releases/tag/${metadata.projectVersion}`;
document.querySelector(".project-version").textContent =
  metadata.projectVersion;
document.querySelector(".version-name").textContent = metadata.versionName;
document.querySelector(".project-channel").textContent = metadata.channel;

const licenseContainer = document.querySelector(".license-container");
// eslint-disable-next-line no-unused-vars
const displayLicence = (() => {
    metadata.licenses.forEach(license => {
        const newLicense = document.createElement("a");
        newLicense.href = license.copy;
        newLicense.className = "lios-window-value-row";
        newLicense.innerHTML = // html
            `<span class = "key">${license.for}</span>
             <span class = "value"> ${license.license}</span>
            `;
        licenseContainer.appendChild(newLicense);
    });
})();
