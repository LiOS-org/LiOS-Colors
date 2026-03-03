const metadataFile = await fetch("/metadata.json");
let metadata;
const parseMetadata = async() => {
    metadata = await metadataFile.json();
};
parseMetadata()
export { metadata };