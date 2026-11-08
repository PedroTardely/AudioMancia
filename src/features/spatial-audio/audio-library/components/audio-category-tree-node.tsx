import { useState } from "react";

import type { AudioCategoryNode } from "../utils/build-audio-library-tree";

import type { AudioAsset } from "../../../../../shared/types/audio-asset";
import type { AudioCategory } from "../../../../../shared/types/audio-category";
import type { AudioFolder } from "../../../../../shared/types/audio-folder";

import { AudioFolderTreeNode } from "./audio-folder-tree-node";
import { AudioAssetTreeNode } from "./audio-asset-tree-node";

interface AudioCategoryTreeNodeProps {
    node: AudioCategoryNode;
    folders: AudioFolder[];
    categories: AudioCategory[];

    onRename: (
        categoryId: string,
        newName: string
    ) => Promise<void>;

    onDelete: (
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
    
export const  AudioCategoryTreeNode = ({
    node,
    categories,
    folders,
    onRename,
    onDelete,
    onRenameFolder,
    onDeleteFolder,
    onMoveFolder,
    onRenameAsset,
    onDeleteAsset,
    onMoveAsset,
    onAddToCanvas
}: AudioCategoryTreeNodeProps ) => {
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
            await onRename(
                node.category.id,
                normalizedName
            );

            setNewName('');
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : 'Não foi possível renomear a categoria.'
            );
        } finally {
            setIsRenaming(false);
        }
    };

    const handleDelete = async () => {
        if (isDeleting || isRenaming) return;

        const confirmed = window.confirm(
            `Excluir a categoria "${node.category.name}"?`
        );

        if (!confirmed) return;

        setIsDeleting(true);
        setError(null);

        try {
            await onDelete(node.category.id);
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : 'Não foi possível excluir a categoria.'
            );
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <li>
            <details>
                <summary>{node.category.name}</summary>

                <div>
                    <input 
                        type="text"
                        placeholder="Novo nome da categoria"
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
                        Renomear categoria
                     </button>

                     <button
                        disabled={isDeleting || isRenaming}
                        onClick={() => void handleDelete()}
                     >
                        Excluir categoria
                     </button>

                     {error && <p role="alert">{error}</p>}
                </div>

                <ul>
                    {node.folders.map(folderNode => (
                        <AudioFolderTreeNode 
                            key={folderNode.folder.relativePath}
                            node={folderNode}
                            categories={categories}
                            folders={folders}
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
}
