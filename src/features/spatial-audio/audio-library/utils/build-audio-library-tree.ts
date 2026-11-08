import type { AudioAsset } from "../../../../../shared/types/audio-asset";
import type { AudioCategory } from "../../../../../shared/types/audio-category";
import type { AudioFolder } from "../../../../../shared/types/audio-folder";

import { normalizePath, getParentPath } from "./audio-library-path";

export interface AudioFolderNode {
    folder: AudioFolder;
    folders: AudioFolderNode[];
    assets: AudioAsset[];
}

export interface AudioCategoryNode {
    category: AudioCategory;
    folders: AudioFolderNode[];
    assets: AudioAsset[];
}

export const buildAudioLibraryTree = (
    categories: AudioCategory[],
    folders: AudioFolder[],
    assets: AudioAsset[]
): AudioCategoryNode[] => {
    const categoryMap = new Map<string, AudioCategoryNode>();
    const folderMap = new Map<string, AudioFolderNode>();

    for (const category of categories) {
        categoryMap.set(category.id, {
            category,
            folders: [],
            assets: []
        });
    }

    for (const folder of folders) {
        folderMap.set(normalizePath(folder.relativePath), {
            folder,
            folders: [],
            assets: []
        });
    }

    for (const folder of folders) {
        const folderPath = normalizePath(folder.relativePath);
        const parentPath = getParentPath(folderPath);

        const node = folderMap.get(folderPath);
        const categoryNode = categoryMap.get(folder.categoryId);
        
        if (!node || !categoryNode) continue;

        const categoryPath = normalizePath(
            categoryNode.category.relativePath
        );

        if (parentPath === categoryPath) {
            categoryNode.folders.push(node);
            continue;
        }

        const parentFolder = folderMap.get(parentPath);


        if (
            parentFolder &&
            parentFolder.folder.categoryId === folder.categoryId
        ) {
            parentFolder.folders.push(node);
        } else {
            console.warn(
                `Pasta com diretório pai inválido: ${folder.relativePath}`
            );
        }
    }

    for (const asset of assets) {
        const parentPath = getParentPath(asset.relativePath);

        const categoryNode = categoryMap.get(asset.categoryId);
        const parentFolder = folderMap.get(parentPath);

        if (!categoryNode) continue;

        if (
            parentFolder &&
            parentFolder.folder.categoryId === asset.categoryId
        ) {
            parentFolder.assets.push(asset);
        } else {
            categoryNode.assets.push(asset);
        }
    }

    return [...categoryMap.values()];
}