const metadataFile = await fetch("/metadata.json");
let metadata;
export const parseMetadata = async() => {
    metadata = await metadataFile.json();
    return metadata;
};
export { metadata };