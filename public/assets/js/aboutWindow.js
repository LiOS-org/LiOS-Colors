import { liosOpen } from "../../LiOS-Open/liosOpen.js";
import { metadata } from "./metadata.js";

// Window (About)
    export const aboutWindow = await liosOpen.window.new();
    aboutWindow.applyEffect.frostedGlass();
    aboutWindow.setId("About");
    aboutWindow.setTitle("About");

    const aboutWindowContents = await aboutWindow.getController();

    const favicon = await aboutWindowContents.newChild("img");
    favicon.attributes(
        {
            "style": `
                size: 1/1;
                width: 20vw;
                display: flex;
                justify-self: center;
                margin-top: 15px;
            `,
            "src": metadata.favicon
        }
    );
    favicon.appendTo("root");

    const heading = await aboutWindowContents.newChild("h2");
    heading.textContent(metadata.projectName);
    heading.attributes({
        "style": `
            text-align: center;
        `
    });
    heading.appendTo("root");

    const aboutHr1 = await aboutWindowContents.newChild("hr");
    aboutHr1.appendTo("root");

    const description = await aboutWindowContents.newChild("p");
    description.textContent(metadata.projectDescription);
    description.attributes({
        "style": `
            text-align: center;
            text-wrap: wrap;
        `
    });
    description.appendTo("root");
    
    // General Information (About Window)
    const generalInformation = await aboutWindowContents.newChild();
    generalInformation.classList("lios-window-card", "lios-frosted-glass");

    const generalInformationTitle = await aboutWindowContents.newChild();
    generalInformationTitle.classList("lios-window-container-title");
    generalInformationTitle.textContent("General Information");
    generalInformationTitle.appendTo(generalInformation);

    const projectVersion = await aboutWindowContents.newChild("a");
    projectVersion.classList("lios-window-value-row");

    const projectVersionKey = await aboutWindowContents.newChild("span");
    projectVersionKey.classList("key");
    projectVersionKey.textContent("Version");
    projectVersionKey.appendTo(projectVersion);

    const projectVersionValue = await aboutWindowContents.newChild("span");
    projectVersionValue.classList("key");
    projectVersionValue.textContent(metadata.projectVersion);
    projectVersionValue.appendTo(projectVersion);

    projectVersion.appendTo(generalInformation);

    const projectVersionName = await aboutWindowContents.newChild("a");
    projectVersionName.classList("lios-window-value-row");

    const projectVersionNameKey = await aboutWindowContents.newChild("span");
    projectVersionNameKey.classList("key");
    projectVersionNameKey.textContent("Version Name");
    projectVersionNameKey.appendTo(projectVersionName);

    const projectVersionNameValue = await aboutWindowContents.newChild("span");
    projectVersionNameValue.classList("key");
    projectVersionNameValue.textContent(metadata.versionName);
    projectVersionNameValue.appendTo(projectVersionName);

    projectVersionName.appendTo(generalInformation);

    const projectChannel = await aboutWindowContents.newChild("a");
    projectChannel.classList("lios-window-value-row");

    const projectChanelKey = await aboutWindowContents.newChild("span");
    projectChanelKey.classList("key");
    projectChanelKey.textContent("Channel");
    projectChanelKey.appendTo(projectChannel);

    const projectChannelValue = await aboutWindowContents.newChild("span");
    projectChannelValue.classList("key");
    projectChannelValue.textContent(metadata.channel);
    projectChannelValue.appendTo(projectChannel);

    projectChannel.appendTo(generalInformation);

    const liosOpenVersion = await aboutWindowContents.newChild("a");
    liosOpenVersion.classList("lios-window-value-row");

    const liosOpenVersionKey = await aboutWindowContents.newChild("span");
    liosOpenVersionKey.classList("key");
    liosOpenVersionKey.textContent("LiOS-Open Version");
    liosOpenVersionKey.appendTo(liosOpenVersion);

    const liosOpenVersionValue = await aboutWindowContents.newChild("span");
    liosOpenVersionValue.classList("key");
    liosOpenVersionValue.textContent("Unreleased,rolling");
    liosOpenVersionValue.appendTo(liosOpenVersion);

    liosOpenVersion.appendTo(generalInformation);
    generalInformation.appendTo("root");
    // 

    // Licensing Information (About Window)
    const licensingInformation = await aboutWindowContents.newChild();
    licensingInformation.classList("lios-window-card", "lios-frosted-glass");

    const licensingInformationTitle = await aboutWindowContents.newChild();
    licensingInformationTitle.classList("lios-window-container-title");
    licensingInformationTitle.textContent("License Information");
    licensingInformationTitle.appendTo(licensingInformation);

    for (const license of metadata.licenses) {
        const keyValue = await aboutWindowContents.newChild("a");
        keyValue.classList("lios-window-value-row");
        keyValue.attributes({
            "href":license.copy
        });

        const key = await aboutWindowContents.newChild("span");
        key.classList("key");
        key.textContent(license.for);
        key.appendTo(keyValue);

        const value = await aboutWindowContents.newChild("span");
        value.classList("key");
        value.textContent(license.license);
        value.appendTo(keyValue);

        keyValue.appendTo(licensingInformation);
    };

    licensingInformation.appendTo("root");
    // 

    aboutWindowContents.render();