import { useState } from "react";

import type { AudioFolder } from "../../../../../shared/types/audio-folder";
import type { AudioCategory } from "../../../../../shared/types/audio-category";

import { normalizePath, getParentPath, isSameOrDescendant } from "../utils/audio-library-path";

interface AudioFolderMoveProps {
  folder: AudioFolder;
  folders: AudioFolder[];
  categories: AudioCategory[];

  onMove: (
    folderRelativePath: string,
    destinationCategoryId: string,
    destinationFolderRelativeId?: string,
  ) => Promise<void>;
}

export const AudioFolderMove = ({
  folder,
  folders,
  categories,
  onMove,
}: AudioFolderMoveProps) => {
    const [categoryId, setCategoryId] = useState("");
    const [destinationFolderPath, setDestinationFolderPath] = useState("");

    const [isMoving, setIsMoving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const availableFolders = folders.filter(
        candidate => 
            candidate.categoryId === categoryId &&
            !isSameOrDescendant(
                folder.relativePath,
                candidate.relativePath
            )
    );

    const handleMove = async () => {
        if (
            !categoryId || 
            isMoving||
            isSameDestination
        ) {
            return;
        }

        setIsMoving(true);
        setError(null);

        try {
            await onMove(
                folder.relativePath,
                categoryId,
                destinationFolderPath || undefined
            );

            setCategoryId('');
            setDestinationFolderPath('');
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : 'Não foi possível mover a pasta.'
            );
        } finally {
            setIsMoving(false);
        }
    };

    const currentParentPath = normalizePath(
        getParentPath(folder.relativePath)
    );

    const selectedCategory = categories.find(
        category => category.id === categoryId
    );

    const selectedDestinationPath = normalizePath(
        destinationFolderPath ||
        selectedCategory?.relativePath ||
        ''
    );

    const isSameDestination = 
        categoryId === folder.categoryId &&
        currentParentPath === selectedDestinationPath

    const currentCategory = categories.find(
        category => category.id === folder.categoryId
    );

    const isCurrentCategoryRoot =
        categoryId === folder.categoryId &&
        currentCategory !== undefined &&
        currentParentPath ===
            currentCategory.relativePath.replace(/\\/g, '/');

    return (
        <div>
            <select 
            value={categoryId}
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
                disabled={!categoryId}
                onChange={(event) => {
                    setDestinationFolderPath(event.target.value);
                }}
            >
                <option 
                    value=""
                    disabled={isCurrentCategoryRoot}
                    >
                    Raiz da categoria
                    {isCurrentCategoryRoot ? ' (Local atual) ' : ''}
                </option>

                {availableFolders.map(candidate => (
                    <option
                        key={candidate.relativePath}
                        value={candidate.relativePath}
                    >
                        {candidate.relativePath}
                    </option>
                ))}
            </select>

            <button
                disabled={
                    !categoryId || 
                    isMoving ||
                    isSameDestination
                }
                onClick={() => void handleMove()}
            >
                {isMoving ? 'Movendo...' : 'Mover pasta'}
            </button>

            {error && <p role="alert">{error}</p>}
        </div>
    )
};
