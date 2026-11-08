import { useState } from "react";

import type { AudioCategory } from "../../../../../shared/types/audio-category";
import type { AudioFolder } from "../../../../../shared/types/audio-folder";
import type { AudioAsset } from "../../../../../shared/types/audio-asset";

import { AudioAssetTreeNode } from "./audio-asset-tree-node";

import type { AudioFolderNode } from "../utils/build-audio-library-tree";

import { AudioFolderMove } from "./audio-folder-move";

interface AudioFolderTreeNodeProps {
    node: AudioFolderNode;

    categories: AudioCategory[];
    folders: AudioFolder[];

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

export const AudioFolderTreeNode = ({
    node,
    categories,
    folders,
    onRenameFolder,
    onDeleteFolder,
    onMoveFolder,
    onRenameAsset,
    onDeleteAsset,
    onMoveAsset,
    onAddToCanvas
}: AudioFolderTreeNodeProps) => {
    const [newName, setNewName] = useState('');
    const [isRenaming, setIsRenaming] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleRename = async () => {
        const normalizedName = newName.trim();

        if (!normalizedName || isRenaming || isDeleting) {
            return;
        }

        setIsRenaming(true);
        setError(null);

        try {
            await onRenameFolder(
                node.folder.relativePath,
                normalizedName
            );
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : 'Não foi possível renomear a pasta.'
            );
        } finally {
            setIsRenaming(false);
        }
    };

    const handleDelete = async () => {
        if (isDeleting || isRenaming) return;

        const confirmed = window.confirm(
            `Excluir a pasta "${node.folder.name}"?`
        );

        if (!confirmed) return

        setIsDeleting(true);
        setError(null);

        try {
            await onDeleteFolder(node.folder.relativePath);
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : 'Não foi possível excluir a pasta.'
            );
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <li>
            <details>
                <summary>{node.folder.name}</summary>

                <div>
                    <input 
                        type="text" 
                        placeholder="Novo nome da pasta"
                        value={newName}
                        onChange={(event) => {
                            setNewName(event.target.value);
                        }}
                    />

                    <button
                        disabled={
                            !newName.trim() ||
                            isRenaming ||
                            isDeleting
                        }
                        onClick={() => void handleRename()}
                    >
                        Renomear pasta
                    </button>

                    <button
                        disabled={isRenaming || isDeleting}
                        onClick={() => void handleDelete()}
                    >
                        Excluir pasta
                    </button>

                    <AudioFolderMove 
                        folder={node.folder}
                        folders={folders}
                        categories={categories}
                        onMove={onMoveFolder}
                    />

                    {error && <p role="alert">{error}</p>}
                </div>

                <ul>
                    {node.folders.map(child => (
                        <AudioFolderTreeNode 
                            key={child.folder.relativePath}
                            node={child}
                            folders={folders}
                            categories={categories}
                            onRenameFolder={onRenameFolder}
                            onDeleteFolder={onDeleteFolder}
                            onMoveFolder={onMoveFolder}
                            onRenameAsset={onRenameAsset}
                            onDeleteAsset={onDeleteAsset}
                            onMoveAsset={onMoveAsset}
                            onAddToCanvas={onAddToCanvas}
                        />
                    ))}

                    {node.assets.map(asset => (
                        <AudioAssetTreeNode 
                            key={asset.id}
                            asset={asset}
                            categories={categories}
                            folders={folders}
                            onRename={onRenameAsset}
                            onDelete={onDeleteAsset}
                            onMove={onMoveAsset}
                            onAddToCanvas={onAddToCanvas}
                        />
                    ))}
                </ul>
            </details>
        </li>
    );
};
