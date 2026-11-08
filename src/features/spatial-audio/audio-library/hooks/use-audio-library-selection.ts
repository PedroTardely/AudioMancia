import { useState } from "react";

import type { AudioAsset } from "../../../../../shared/types/audio-asset";
import type { AudioCategory } from "../../../../../shared/types/audio-category";
import type { AudioFolder } from "../../../../../shared/types/audio-folder";

import type { AudioLibrarySelection } from "../types/audio-library-selection";

import { normalizePath } from "../utils/audio-library-path";

export const useAudioLibrarySelection = (
    categories: AudioCategory[],
    folders: AudioFolder[],
    assets: AudioAsset[]
) => {
    const [requestedSelection, setRequestedSelection] =
        useState<AudioLibrarySelection | null>(null);

    const selection = (() => {
        if (!requestedSelection) return null;

        switch (requestedSelection.type) {
            case 'category':
                return categories.some(
                    category =>
                        category.id === requestedSelection.id
                )
                    ?   requestedSelection
                    :   null;
            case 'folder':
                return folders.some(
                    folder =>
                        normalizePath(folder.relativePath) ===
                    normalizePath(requestedSelection.relativePath)
                )
                    ?   requestedSelection
                    :   null;
            case 'asset':
                return assets.some(
                    asset =>
                        asset.id === requestedSelection.id
                )
                    ? requestedSelection
                    : null;
        }
    })();

    const select = (item: AudioLibrarySelection) => {
        setRequestedSelection(item);
    };

    const clearSelection = () => {
        setRequestedSelection(null);
    };

    return {
        selection,
        select,
        clearSelection
    }
}