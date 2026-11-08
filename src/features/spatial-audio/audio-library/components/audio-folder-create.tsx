import { useState } from "react";

import type { AudioFolder } from "../../../../../shared/types/audio-folder";
import type { AudioCategory } from "../../../../../shared/types/audio-category";

interface AudioFolderCreateProps {
  categories: AudioCategory[];
  folders: AudioFolder[];

  onCreate: (
    name: string,
    categoryId: string,
    parentRelativePath?: string,
  ) => Promise<void>;
}

export const AudioFolderCreate = ({
  categories,
  folders,
  onCreate,
}: AudioFolderCreateProps) => {
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [parentPath, setParentPath] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const availableFolders = folders.filter(
    folder => folder.categoryId === categoryId,
  );

  const handleCreate = async () => {
    const normalizedName = name.trim();

    if (!normalizedName || !categoryId || isCreating) {
      return;
    }

    setIsCreating(true);
    setError(null);

    try {
      await onCreate(normalizedName, categoryId, parentPath || undefined);

      setName("");
      setParentPath("");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Não foi possível criar a pasta.",
      );
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <section>
      <h2>Criar pasta</h2>

      <input 
      type="text" 
      placeholder="Nome da pasta" 
      value={name} 
      onChange={(event) => setName(event.target.value)}
      />
      
      <select 
        value={categoryId}
        onChange={(event) => {
            setCategoryId(event.target.value);
            setParentPath('');
        }}
      >
        <option value="">
            Selecione uma categoria
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
        value={parentPath}
        disabled={!categoryId}
        onChange={(event) => {
            setParentPath(event.target.value);
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
        disabled={!name.trim() || !categoryId || isCreating}
        onClick={() => void handleCreate()}
      >
        {isCreating ? 'Criando...' : 'Criar pasta'}
      </button>

      {error && <p role="alert">{error}</p>}
    </section>
  );
};
