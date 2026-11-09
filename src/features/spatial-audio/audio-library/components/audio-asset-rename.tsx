import { useState } from "react";

interface AudioAssetRenameProps {
    assetId: string;

    onRename: (
        assetId: string,
        newName: string
    ) => Promise<void>;
}

export const AudioAssetRename = ({
    assetId,
    onRename
}: AudioAssetRenameProps) => {
    const [newName, setNewName] = useState('');
    const [isRenaming, setIsRenaming] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleRename = async () => {
        const normalizedName = newName.trim();

        if (!normalizedName || isRenaming ) return;

        setIsRenaming(true);
        setError(null);

        try {
            await onRename(assetId, normalizedName);
            setNewName('');
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : 'Não foi possível renomear o áudio.'
            );
        } finally {
            setIsRenaming(false);
        }
    };

    return (
        <div>
            <h3>Renomear áudio</h3>

            <input 
                type="text" 
                placeholder="Novo nome do áudio"
                value={newName}
                disabled={isRenaming}
                onChange={(event) => {
                    setNewName(event.target.value);
                }}
            />

            <button
                disabled={!newName.trim() || isRenaming}
                onClick={() => void handleRename()}
            >
                {isRenaming ? 'Renomeando...' : 'Renomear áudio'}
            </button>

            {error && <p role="alert">{error}</p>}
        </div>
    )
}