import type { AudioAsset } from "../../../../../shared/types/audio-asset";
import type { AudioCategory } from "../../../../../shared/types/audio-category";
import type { AudioFolder } from "../../../../../shared/types/audio-folder";

import { AudioAssetRename } from "./audio-asset-rename";
import { AudioAssetMove } from "./audio-asset-move";
import { AudioAssetActions } from "./audio-asset-actions";

import type { AudioLibrarySelection } from "../types/audio-library-selection";

interface AudioLibrarySelectionInspectorProps {
  selection: AudioLibrarySelection | null;
  categories: AudioCategory[];
  folders: AudioFolder[];
  assets: AudioAsset[];
  onClearSelection: () => void;

  onRenameAsset: (assetId: string, newName: string) => Promise<void>;

  onMoveAsset: (
    assetId: string,
    categoryId: string,
    destinationFolderPath?: string,
  ) => Promise<void>;

  onDeleteAsset: (assetId: string) => Promise<void>;

  onAddToCanvas: (asset: AudioAsset) => void;
}

export const AudioLibrarySelectionInspector = ({
  selection,
  categories,
  folders,
  assets,
  onClearSelection,
  onRenameAsset,
  onMoveAsset,
  onDeleteAsset,
  onAddToCanvas,
}: AudioLibrarySelectionInspectorProps) => {

  if (!selection) {
    return (
      <section>
        <h2>Item selecionado</h2>
        <p>Nenhum elemento selecionado.</p>
      </section>
    );
  }

  const selectedAsset =
    selection.type === "asset"
      ? assets.find((asset) => asset.id === selection.id)
      : undefined;

  let name = "";
  let type = "";
  let relativePath = "";
  let categoryName = "";

  switch (selection.type) {
    case "category": {
      const category = categories.find((item) => item.id === selection.id);

      if (!category) return null;

      name = category.name;
      type = "Categoria";
      relativePath = category.relativePath;
      break;
    }

    case "folder": {
      const folder = folders.find(
        (item) =>
          item.relativePath.replace(/\\/g, "/") ===
          selection.relativePath.replace(/\\/g, "/"),
      );

      if (!folder) return null;

      const category = categories.find((item) => item.id === folder.categoryId);

      name = folder.name;
      type = "Pasta";
      relativePath = folder.relativePath;
      categoryName = category?.name ?? "Não encontrada";
      break;
    }

    case "asset": {
      if (!selectedAsset) return null;

      const category = categories.find(
        (item) => item.id === selectedAsset.categoryId,
      );

      name = selectedAsset.name;
      type = "Áudio";
      relativePath = selectedAsset.relativePath;
      categoryName = category?.name ?? "Não encontrada";

      break;
    }
  }

  return (
    <section>
      <h2>Item selecionado</h2>

      <p>Tipo: {type}</p>
      <p>Nome: {name}</p>
      <p>Local: {relativePath}</p>

      {categoryName && <p>Categoria: {categoryName}</p>}

      {selectedAsset && (
        <>
          <AudioAssetRename
            key={selectedAsset.id}
            assetId={selectedAsset.id}
            onRename={onRenameAsset}
          />

          <AudioAssetMove
            key={`move-${selectedAsset.id}`}
            asset={selectedAsset}
            categories={categories}
            folders={folders}
            onMove={onMoveAsset}
          />

          <AudioAssetActions
            key={`actions-${selectedAsset.id}`}
            asset={selectedAsset}
            onDelete={onDeleteAsset}
            onAddToCanvas={onAddToCanvas}
            onDeleted={onClearSelection}
          />
        </>
      )}
      <button onClick={onClearSelection}>Limpar seleção</button>
    </section>
  );
};
