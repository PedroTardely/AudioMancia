import type { AudioLibraryData } from "../../shared/types/audio-library-data.js";

const isRecord = (
    value: unknown
): value is Record<string, unknown> => {
    return (
        typeof value === 'object' &&
        value !== null &&
        !Array.isArray(value)
    );
};

export const isAudioLibraryData = (
    value: unknown
): value is AudioLibraryData => {
    if (!isRecord(value)) {
        return false;
    }

    if (
        !Array.isArray(value.categories) ||
        !Array.isArray(value.folders) ||
        !Array.isArray(value.assets)
    ) {
        return false;
    }

    const validCategories = value.categories.every(
        category =>
            isRecord(category) &&
            typeof category.id === 'string' &&
            typeof category.name === 'string' &&
            typeof category.relativePath === 'string'
    );

    const validFolders = value.folders.every(
        folder =>
            isRecord(folder) &&
            typeof folder.name === 'string' &&
            typeof folder.categoryId === 'string' &&
            typeof folder.relativePath === 'string'
    );

    const validAssets = value.assets.every(
        asset =>
            isRecord(asset) &&
            typeof asset.id === 'string' &&
            typeof asset.name === 'string' &&
            typeof asset.categoryId === 'string' &&
            typeof asset.relativePath === 'string'
    );

    return (
        validCategories &&
        validFolders &&
        validAssets
    );
};