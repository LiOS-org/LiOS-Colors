export const searchHandler = (query, index) => {
    const normalizedquery = query.trim().toLowerCase();
    return index.filter(color =>
        color.name.toLowerCase().includes(normalizedquery)
    );
};