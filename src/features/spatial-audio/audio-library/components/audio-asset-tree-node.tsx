import { useState } from "react";

import type { AudioAsset } from "../../../../../shared/types/audio-asset";
import type { AudioCategory } from "../../../../../shared/types/audio-category";
import type { AudioFolder } from "../../../../../shared/types/audio-folder";

import { normalizePath, getParentPath } from "../utils/audio-library-path";

interface AudioAssetTreeNodeProps {
    asset: AudioAsset;
    categories: AudioCategory[];
    folders: AudioFolder[];

    onRename: (
        assetId: string,
        newName: string
    ) => Promise<void>;

    onDelete: (
        assetId: string
    ) => Promise<void>;

    onMove: (
        assetId: string,
        categoryId: string,
        destinationFolderPath?: string
    ) => Promise<void>;

    onAddToCanvas: (asset: AudioAsset) => void;
}

export const AudioAssetTreeNode = ({
    asset,
    categories,
    folders,
    onRename,
    onDelete,
    onMove,
    onAddToCanvas
}: AudioAssetTreeNodeProps) => {
    const [newName, setNewName] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [destinationFolderPath, setDestinationFolderPath] = useState('');

    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const availableFolders = folders.filter(
        folder => folder.categoryId === categoryId,
    );

    const currentParentPath = getParentPath(
        asset.relativePath
    );

    const selectedCategory = categories.find(
        category => category.id === categoryId
    );

    const destinationPath = normalizePath(
        destinationFolderPath ||
        selectedCategory?.relativePath ||
        ''
    );

    const isSameDestination = 
        categoryId === asset.categoryId &&
        currentParentPath === destinationPath;

    const canMove =
        Boolean(selectedCategory) &&
        !isSameDestination &&
        !isProcessing;

    const handleRename = async () => {
        const normalizedName = newName.trim();

        if (!normalizedName || isProcessing) return;
        

        setIsProcessing(true);
        setError(null);

        try {
            await onRename(
                asset.id,
                normalizedName
            );

            setNewName('');
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : 'Não foi possível renomear o áudio.'
            );
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDelete = async () => {
        if (isProcessing) return;

        const confirmed = window.confirm(
            `Excluir o áudio "${asset.name}"?`
        );

        if (!confirmed) return;

        setIsProcessing(true);
        setError(null);

        try {
            await onDelete(asset.id);
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : 'Não foi possível excluir o áudio.'
            );
        } finally {
            setIsProcessing(false);
        }
    };

    const handleMove = async () => {
        if (!canMove) return;


        setIsProcessing(true);
        setError(null);

        try {
            await onMove(
                asset.id,
                categoryId,
                destinationFolderPath || undefined
            );

            setCategoryId('');
            setDestinationFolderPath('');
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : 'Não foi possível mover o áudio.'
            );
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <li>
            <p>{asset.name}</p>

            <input 
                type="text" 
                placeholder="Novo nome do áudio"
                value={newName}
                disabled={isProcessing}
                onChange={(event) => {
                    setNewName(event.target.value);
                }}
            />

            <button
                disabled={
                    !newName.trim() ||
                    isProcessing
                }
                onClick={() => void handleRename()}
            >
                Renomear
            </button>
            <button
                disabled={isProcessing}
                onClick={() => void handleDelete()}
            >
                Excluir
            </button>
            <button
                disabled={isProcessing}
                onClick={() => onAddToCanvas(asset)}
            >
                + Adicionar ao Canvas
            </button>

            <div>
            <select 
                value={categoryId}
                disabled={isProcessing}
                onChange={(event) => {
                    setCategoryId(event.target.value);
                    setDestinationFolderPath('');
                }}
            >
                <option value="">
                    Selecione uma categoria de destino
                </option>

                {categories.map(category => (
                    <option
                        key={category.id}
                        value={category.id}
                    >
                        {category.name}
                    </option>
                ))}
            </select>

            <select
                value={destinationFolderPath}
                disabled={!categoryId || isProcessing}
                onChange={(event) => {
                    setDestinationFolderPath(event.target.value);
                }}
            >
                <option 
                    value=""
                >
                    Raiz da categoria
                </option>

                {availableFolders.map(folder => (
                    <option
                        key={folder.relativePath}
                        value={folder.relativePath}
                    >
                        {folder.relativePath}
                    </option>
                ))}
            </select>

            <button
                disabled={!canMove}
                onClick={() => void handleMove()}
            >
                {isProcessing ? 'Processando...' : 'Mover áudio'}
            </button>

            {error && <p role="alert">{error}</p>}
        </div>
        </li>
    )
}