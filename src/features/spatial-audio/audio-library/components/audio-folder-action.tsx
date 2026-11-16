import { useState } from "react";

import type { AudioFolder } from "../../../../../shared/types/audio-folder";

interface AudioFolderActionsProps {
  folder: AudioFolder;

  onRename: (folderPath: string, newName: string) => Promise<void>;

  onDelete: (folderPath: string) => Promise<void>;

  onDeleted: () => void;
}

export const AudioFolderActions = ({
  folder,
  onRename,
  onDelete,
  onDeleted,
}: AudioFolderActionsProps) => {
  const [newName, setNewName] = useState(folder.name);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRename = async () => {
    const name = newName.trim();

    if (!name || name === folder.name || isProcessing) return;

    setIsProcessing(true);
    setError(null);

    try {
      await onRename(folder.relativePath, name);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Não foi possível renomear a pasta.",
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async () => {
        if (isProcessing) return;

        const confirmed = window.confirm(
            `Excluir a pasta "${folder.name}"?`
        );

        if (!confirmed) return

        setIsProcessing(true);
        setError(null);

        try {
            await onDelete(folder.relativePath);
            onDeleted();
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : 'Não foi possível excluir a pasta.'
            );
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div>
            <h3>Gerenciar pasta</h3>

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
                    newName.trim() === folder.name
                }
                onClick={() => void handleRename()}
            >
                Renomear pasta
            </button>

            <button
                type="button"
                disabled={isProcessing}
                onClick={() => void handleDelete()}
            >
                Excluir pasta
            </button>

            {error && <p role="alert">{error}</p>}
        </div>
    );
};
