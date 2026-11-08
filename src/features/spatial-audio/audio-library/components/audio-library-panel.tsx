import type { AudioAsset } from "../../../../../shared/types/audio-asset";
import type { AudioCategory } from "../../../../../shared/types/audio-category";
import type { AudioFolder } from "../../../../../shared/types/audio-folder";

import { AudioImportForm } from "./audio-import-form";
import { AudioCategoryCreate } from "./audio-category-create";
import { AudioFolderCreate } from "./audio-folder-create";
import { AudioLibraryTree } from "./audio-library-tree";

interface AudioLibraryPanelProps {
    assets: AudioAsset[];
    categories:AudioCategory[];
    folders: AudioFolder[];

    onRenameAsset: (id: string, name: string)  => Promise<void>;
    onDeleteAsset: (id: string) => Promise<void>;

    onMoveAsset: (
        assetId: string,
        category: string,
        folderRelativePath?: string
    ) => Promise<void>;

    onAddToCanvas: (asset: AudioAsset) => void;

    onRenameCategory: (
        id: string,
        name: string
    ) => Promise<void>;

    onDeleteCategory:(
        id: string
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

    onImportAudio: (
        categoryId: string,
        folderRelativePath?: string
    ) => Promise<void>;

    onCreateCategory: (name: string) => Promise<void>;

    onCreateFolder: (
        name: string,
        categoryId: string,
        parentRelativePath?: string
    ) => Promise<void>;
}

export const AudioLibraryPanel = ({
    assets,
    categories,
    folders,
    onRenameAsset,
    onDeleteAsset,
    onMoveAsset,
    onAddToCanvas,
    onRenameCategory,
    onDeleteCategory,
    onCreateFolder,
    onRenameFolder,
    onDeleteFolder,
    onMoveFolder,
    onImportAudio,
    onCreateCategory
}: AudioLibraryPanelProps) => {
    return (
    <>

    < AudioCategoryCreate
        onCreate={onCreateCategory}
    />


    <AudioImportForm
        categories={categories}
        folders={folders}
        onImport={onImportAudio}
    />

    <AudioFolderCreate
        categories={categories}
        folders={folders}
        onCreate={onCreateFolder}
    />
    

    <AudioLibraryTree
        categories={categories}
        folders={folders}
        assets={assets}

        onRenameCategory={onRenameCategory}
        onDeleteCategory={onDeleteCategory}

        onRenameFolder={onRenameFolder}
        onDeleteFolder={onDeleteFolder}
        onMoveFolder={onMoveFolder}

        onRenameAsset={onRenameAsset}
        onDeleteAsset={onDeleteAsset}
        onMoveAsset={onMoveAsset}
        onAddToCanvas={onAddToCanvas}
    />

    </>
    )
}