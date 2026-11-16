import { useState } from "react";

import type { AudioCategory } from "../../../../../shared/types/audio-category";

interface AudioCategoryActionsProps {
    category: AudioCategory;

    onRename: (
        categoryId: string,
        newName: string
    ) => Promise<void>;

    onDelete: (
        categoryId: string
    ) => Promise<void>;

    onDeleted: () => void;
}

export const AudioCategoryActions = ({
    category,
    onRename,
    onDelete,
    onDeleted
}: AudioCategoryActionsProps) => {
    const [newName, setNewName] = useState(category.name);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleRename = async () => {
        const name = newName.trim();

        if (
            !name ||
            name === category.name ||
            isProcessing
        ) return;

        setIsProcessing(true);
        setError(null);

        try {
            await onRename(category.id, name);
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : 'Não foi possível renomear a categoria.'
            );
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDelete = async () => {
        if (isProcessing) return;

        const confirmed = window.confirm(
            `Excluir a categoria "${category.name}"?`
        );

        if(!confirmed) return;

        setIsProcessing(true);
        setError(null);

        try {
            await onDelete(category.id);
            onDeleted();
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : 'Não foi possível excluir a categoria.'
            );
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div>
            <h3>Gerenciar categoria</h3>

            <input 
                type="text" 
                value={newName}
                disabled={isProcessing}
                onChange={(event) => {
                    setNewName(event.target.value);
                    setError(null);
                }}
            />

            <button
                type="button"
                disabled={
                    isProcessing ||
                    !newName.trim() ||
                    newName.trim() === category.name
                }
                onClick={() => void handleRename()}
            >
                Renomear categoria
            </button>

            <button
                type="button"
                disabled={isProcessing}
                onClick={() => void handleDelete()}
            >
                Excluir categoria
            </button>

            {error && <p role="alert">{error}</p>}
        </div>
    )
}

