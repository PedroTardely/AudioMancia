import { useMemo } from "react";

import type { AudioAsset } from "../../../../../shared/types/audio-asset";
import type { AudioCategory } from "../../../../../shared/types/audio-category";
import type { AudioFolder } from "../../../../../shared/types/audio-folder";
import type { AudioLibrarySelection } from "../types/audio-library-selection";

import { buildAudioLibraryTree } from "../utils/build-audio-library-tree";
import { AudioCategoryTreeNode } from "./audio-category-tree-node";

interface AudioLibraryTreeProps {
    categories: AudioCategory[];
    folders: AudioFolder[];
    assets: AudioAsset[];

    onSelect: (selection: AudioLibrarySelection) => void;
}

export const AudioLibraryTree =({
    categories,
    folders,
    assets,
    onSelect
}: AudioLibraryTreeProps) => {
    const tree = useMemo(
        () => buildAudioLibraryTree(
                categories,
                folders,
                assets
        ),
        [categories, folders, assets]
    );

    return (
        <section>
            <h2>Biblioteca de áudio</h2>

            <ul>
                {tree.map(categoryNode => (
                    <AudioCategoryTreeNode 
                        key={categoryNode.category.id}
                        node={categoryNode}
                        onSelect={onSelect}
                    />
                ))}
            </ul>
        </section>
    )
}