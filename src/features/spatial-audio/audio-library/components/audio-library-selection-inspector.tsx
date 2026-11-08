import type { AudioAsset } from "../../../../../shared/types/audio-asset";
import type { AudioCategory } from "../../../../../shared/types/audio-category";
import type { AudioFolder } from "../../../../../shared/types/audio-folder";

import type { AudioLibrarySelection } from "../types/audio-library-selection";

interface AudioLibrarySelectionInspectorProps {
    selection: AudioLibrarySelection | null;
    categories: AudioCategory[];
    folders: AudioFolder[];
    assets: AudioAsset[];
    onClearSelection: () => void;
}

export const AudioLibrarySelectionInspector = ({
    selection,
    categories,
    folders,
    assets,
    onClearSelection
}: AudioLibrarySelectionInspectorProps) => {
    if (!selection) {
        return (
            <section>
                <h2>Item selecionado</h2>
                <p>Nenhum elemento selecionado.</p>
            </section>
        );
    }

    let name = '';
    let type = '';
    let relativePath = '';
    let categoryName = '';

    switch (selection.type) {
        case 'category': {
            const category = categories.find(
                item => item.id === selection.id
            );

            if (!category) return null;

            name = category.name;
            type = 'Categoria';
            relativePath = category.relativePath;
            break;
        }

        case 'folder': {
            const folder = folders.find(
                item => item.relativePath.replace(/\\/g, '/') ===
                    selection.relativePath.replace(/\\/g, '/')
            );

            if (!folder) return null;

            const category = categories.find(
                item => item.id === folder.categoryId
            );

            name = folder.name
            type = 'Pasta';
            relativePath = folder.relativePath;
            categoryName = category?.name ?? 'Não encontrada';
            break
        }

        case 'asset': {
            const asset = assets.find(
                item => item.id === selection.id
            );

            if (!asset) return null;

            const category = categories.find(
                item => item.id === asset.categoryId
            );

            name = asset.name;
            type = 'Áudio';
            relativePath = asset.relativePath;
            categoryName = category?.name ?? 'Não encontrada';
            break
        }
    }

    return (
        <section>
            <h2>Item selecionado</h2>

            <p>Tipo: {type}</p>
            <p>Nome: {name}</p>
            <p>Local: {relativePath}</p>

            {categoryName && (
                <p>Categoria: {categoryName}</p>
            )}

            <button onClick={onClearSelection}>
                Limpar seleção
            </button>
        </section>
    )
}