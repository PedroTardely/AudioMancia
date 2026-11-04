import type { AudioAsset } from "../../../../../shared/types/audio-asset";
import type { AudioCategory } from "../../../../../shared/types/audio-category";
import type { AudioFolder } from "../../../../../shared/types/audio-folder";

import { AudioAssetList } from "./audio-asset-list";

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
}

export const AudioLibraryPanel = ({
    assets,
    categories,
    folders,
    onRenameAsset,
    onDeleteAsset,
    onMoveAsset,
    onAddToCanvas
}: AudioLibraryPanelProps) => {
    return (
        <AudioAssetList
        assets={assets}
        categories={categories}
        folders={folders}
        onRename={onRenameAsset}
        onDelete={onDeleteAsset}
        onMove={onMoveAsset}
        onAddToCanvas={onAddToCanvas}
    />
    )
}