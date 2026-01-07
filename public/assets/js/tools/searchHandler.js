export const searchHandler = (query, index) => {
    const normalizeduery = query.trim().toLowerCase();
    return index.filter(color =>
        color.name.toLowerCase().includes(normalizeduery)
    );
};