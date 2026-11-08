import { useState } from "react";

interface AudioCategoryCreateProps {
    onCreate: (name: string) => Promise<void>;
}

export const AudioCategoryCreate = ({
    onCreate
}: AudioCategoryCreateProps) => {
    const [name, setName] = useState("");
    const [isCreating, setIscreating] = useState(false);
    const [error, setError] =useState<string | null>(null);

    const handleCreate = async () => {

        const normalizedName = name.trim();

        if (!normalizedName || isCreating) {
            return;
        }

        setIscreating(true);
        setError(null);

        try {
            await onCreate(normalizedName);
            setName('');
        } catch (error) {
            const message = error instanceof Error
                ? error.message
                : 'Não foi possível criar a categoria.';

            setError(message);
        } finally {
            setIscreating(false);
        }
    };

    return (
        <section>
            <h2>Criar categoria</h2>

            <input 
                type="text" 
                placeholder="Nome da categoria"
                value={name}
                onChange={(event) => {
                    setName(event.target.value);
                }}
            />

            <button
                disabled={!name.trim() || isCreating}
                onClick={() => void handleCreate()}
            >
                {isCreating ? 'Criando...' : 'Criar categoria'}
            </button>

            {error && <p role="alert">{error}</p>}
        </section>
    );
};