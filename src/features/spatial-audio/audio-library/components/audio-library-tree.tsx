import { useMemo } from "react";

import type { AudioAsset } from "../../../../../shared/types/audio-asset";
import type { AudioCategory } from "../../../../../shared/types/audio-category";
import type { AudioFolder } from "../../../../../shared/types/audio-folder";

import { buildAudioLibraryTree } from "../utils/build-audio-library-tree";
import { AudioCategoryTreeNode } from "./audio-category-tree-node";

interface AudioLibraryTreeProps {
    categories: AudioCategory[];
    folders: AudioFolder[];
    assets: AudioAsset[];

    onRenameCategory: (
        categoryId: string,
        newName: string
    ) => Promise<void>;

    onDeleteCategory: (
        categoryId: string
    ) => Promise<void>;

    onRenameFolder: (
        relativePath: string,
        newName: string
    ) => Promise<void>;

    onDeleteFolder: (
        relativePath: string
    ) => Promise<void>;

    onMoveFolder: (
        relativePath: string,
        categoryId: string,
        destinationFolderRelativePath?: string
    ) => Promise<void>;

    onRenameAsset: (
        assetId: string,
        newName: string
    ) => Promise<void>;

    onDeleteAsset: (
        assetId: string
    ) => Promise<void>;

    onMoveAsset: (
        assetId: string,
        categoryId: string,
        destinationFolderPath?: string
    ) => Promise<void>;

    onAddToCanvas: (asset: AudioAsset) => void;
}

export const AudioLibraryTree =({
    categories,
    folders,
    assets,
    onRenameCategory,
    onDeleteCategory,
    onRenameFolder,
    onDeleteFolder,
    onMoveFolder,
    onRenameAsset,
    onDeleteAsset,
    onMoveAsset,
    onAddToCanvas
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
                        categories={categories}
                        folders={folders}

                        onRename={onRenameCategory}
                        onDelete={onDeleteCategory}

                        onRenameFolder={onRenameFolder}
                        onDeleteFolder={onDeleteFolder}
                        onMoveFolder={onMoveFolder}

                        onRenameAsset={onRenameAsset}
                        onDeleteAsset={onDeleteAsset}
                        onMoveAsset={onMoveAsset}
                        onAddToCanvas={onAddToCanvas}
                    />
                ))}
            </ul>
        </section>
    )
}