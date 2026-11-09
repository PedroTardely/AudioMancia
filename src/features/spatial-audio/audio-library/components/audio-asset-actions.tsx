import { useState } from "react";

import type { AudioAsset } from "../../../../../shared/types/audio-asset";

interface AudioAssetActionsProps {
    asset: AudioAsset;
    
    onDelete: (assetId: string) => Promise<void>;
    onAddToCanvas: (asset: AudioAsset) => void;
    onDeleted: () => void;

}

export const AudioAssetActions = ({
    asset,
    onDelete,
    onAddToCanvas,
    onDeleted
}: AudioAssetActionsProps) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleDelete = async () => {
    if (isDeleting) return;

    const confirmed = window.confirm(
      `Excluir o áudio "${asset.name}"?`,
    );

    if (!confirmed) return;

    setIsDeleting(true);
    setError(null);

    try {
      await onDelete(asset.id);
      onDeleted();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Não foi possível excluir o áudio.",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
        <button
            type="button"
            disabled={isDeleting}
            onClick={() => onAddToCanvas(asset)}
          >
            + Adicionar ao Canvas
          </button>

          <button 
                type="button"
                disabled={isDeleting} 
                onClick={() => void handleDelete()}
            >
            {isDeleting ? 'Excluindo...' : 'Excluir áudio'}
          </button>

          {error && (<p role="alert">{error}</p>)}
    </div>
  )
}