import { useState } from "react";

import type { AudioFolder } from "../../../../../shared/types/audio-folder";
import type { AudioCategory } from "../../../../../shared/types/audio-category";

interface AudioImportFormProps {
    categories: AudioCategory[];
    folders: AudioFolder[];

    onImport: (
        categoryId: string,
        folderRelativePath?: string
    ) => Promise<void>;
}

export const AudioImportForm = ({
    categories,
    folders,
    onImport
}: AudioImportFormProps) => {
    const [categoryId, setCategoryId] = useState('');
    const [folderPath, setFolderPath] = useState('');
    const [isImporting, setIsImporting] = useState(false);

    const availableFolders = folders.filter(
        folder => folder.categoryId === categoryId
    );

    const handleImport = async () => {
        if (!categoryId || isImporting) return;

        setIsImporting(true);

        try{
            await onImport(
                categoryId,
                folderPath || undefined
            );
        } catch (error) {
            console.error('Falha na importação:', error);
        } finally {
            setIsImporting(false);
        }
    };

    return (
        <section>
            <h2>Importar áudio</h2>

            <select
                value={categoryId}
                onChange={(event) => {
                    setCategoryId(event.target.value);
                    setFolderPath('');
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
                value={folderPath}
                disabled={!categoryId}
                onChange={(event) => {
                    setFolderPath(event.target.value);
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
                disabled={!categoryId || isImporting}
                onClick={() => void handleImport()}
            >
                {isImporting
                    ? 'Importando...'
                    : 'Importar áudio'
                }
            </button>
        </section>
    );
};