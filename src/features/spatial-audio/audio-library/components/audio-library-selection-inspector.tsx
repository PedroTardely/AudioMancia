import type { AudioAsset } from "../../../../../shared/types/audio-asset";
import type { AudioCategory } from "../../../../../shared/types/audio-category";
import type { AudioFolder } from "../../../../../shared/types/audio-folder";

import { AudioAssetRename } from "./audio-asset-rename";
import { AudioAssetMove } from "./audio-asset-move";
import { AudioAssetActions } from "./audio-asset-actions";
import { AudioCategoryActions } from "./audio-category-actions";
import { AudioFolderActions } from "./audio-folder-action";
import { AudioFolderMove } from "./audio-folder-move";

import { normalizePath } from "../utils/audio-library-path";

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

  onRenameCategory: (categoryId: string, newName: string) => Promise<void>;

  onDeleteCategory: (categoryId: string) => Promise<void>;

  onRenameFolder: (folderPath: string, newName: string) => Promise<void>;

  onDeleteFolder: (folderPath: string) => Promise<void>;

  onMoveFolder: (
    folderPath: string,
    categoryId: string,
    destinationFolderPath?: string,
  ) => Promise<void>;
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
  onRenameCategory,
  onDeleteCategory,
  onRenameFolder,
  onDeleteFolder,
  onMoveFolder,
}: AudioLibrarySelectionInspectorProps) => {
  if (!selection) {
    return (
      <section>
        <h2>Item selecionado</h2>
        <p>Nenhum elemento selecionado.</p>
      </section>
    );
  }

  const selectedCategory =
    selection.type === "category"
      ? categories.find((category) => category.id === selection.id)
      : undefined;

  const selectedFolder =
    selection.type === "folder"
      ? folders.find(
          (folder) =>
            normalizePath(folder.relativePath) ===
            normalizePath(selection.relativePath),
        )
      : undefined;

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
      if (!selectedCategory) return null;

      name = selectedCategory.name;
      type = "Categoria";
      relativePath = selectedCategory.relativePath;

      break;
    }

    case "folder": {
      if (!selectedFolder) return null;

      const category = categories.find(
        (item) => item.id === selectedFolder.categoryId
      );

      name = selectedFolder.name;
      type = "Pasta";
      relativePath = selectedFolder.relativePath;
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

      {selectedCategory && (
        <AudioCategoryActions
            key={`${selectedCategory.id}-${selectedCategory.name}`}
            category={selectedCategory}
            onRename={onRenameCategory}
            onDelete={onDeleteCategory}
            onDeleted={onClearSelection}
          />
      )}

      {selectedFolder && (
        <>
          <AudioFolderActions
          key={selectedFolder.relativePath}
          folder={selectedFolder}
          onRename={onRenameFolder}
          onDelete={onDeleteFolder}
          onDeleted={onClearSelection}
        />

        <AudioFolderMove
          key={`move-${selectedFolder.relativePath}`}
          folder={selectedFolder}
          categories={categories}
          folders={folders}
          onMove={onMoveFolder}
        />
        </>
      )}
      <button onClick={onClearSelection}>Limpar seleção</button>
    </section>
  );
};
