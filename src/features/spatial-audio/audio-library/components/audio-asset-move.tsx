import { useState } from 'react';

import type { AudioAsset } from '../../../../../shared/types/audio-asset';
import type { AudioCategory } from '../../../../../shared/types/audio-category';
import type { AudioFolder } from '../../../../../shared/types/audio-folder';

import { getParentPath, normalizePath } from '../utils/audio-library-path';

interface AudioAssetMoveProps {
    asset: AudioAsset;
    categories:AudioCategory[];
    folders: AudioFolder[];

    onMove: (
        assetId: string,
        category: string,
        folderRelativePath?: string
    ) => Promise<void>;
}

export const AudioAssetMove = ({
    asset,
    categories,
    folders,
    onMove
}: AudioAssetMoveProps) => {
    const [categoryId, setCategoryId] = useState('');
    const [destinationFolderPath, setDestinationFolderPath] = 
        useState('');

    const [isMoving, setIsMoving] = 
        useState(false);

    const [error, setError] = useState<string | null>(null);

    const selectedCategory = categories.find(
        category => category.id === categoryId
    );

    const availableFolders = folders.filter(
        folder => folder.categoryId === categoryId
    );

    const currentParentPath = getParentPath(
        asset.relativePath
    );

    const selectedDestinationPath = normalizePath(
        destinationFolderPath ||
        selectedCategory?.relativePath ||
        ''
    );

    const isSameDestination = 
        categoryId === asset.categoryId &&
        currentParentPath === selectedDestinationPath;


    const canMove =
        Boolean(selectedCategory) &&
        !isSameDestination &&
        !isMoving;

    const handleMove = async () => {
        if (!canMove) return;


        setIsMoving(true);
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
            setIsMoving(false);
        }
    };

    return (
        <div>
            <h3>Mover áudio</h3>

            <select
                value={categoryId}
                disabled={isMoving}
                onChange={(event) => {
                    setCategoryId(event.target.value);
                    setDestinationFolderPath('');
                    setError(null);
                }}
            >
                <option value="">
                    Selecione uma categoria de destino.
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
                disabled={!categoryId || isMoving}
                onChange={(event) => {
                    setDestinationFolderPath(event.target.value);
                    setError(null);
                }}
            >
                <option value="">
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
                type="button"
                disabled={!canMove}
                onClick={() => void handleMove()}
            >
                {isMoving ? 'Movendo...' : 'Mover áudio'}
            </button>

            {error && <p role="alert">{error}</p>}
        </div>
    )
}