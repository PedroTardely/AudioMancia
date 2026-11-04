import { useState } from "react";

import type { AudioAsset } from "../../../../../shared/types/audio-asset";
import type { AudioCategory } from "../../../../../shared/types/audio-category";
import type { AudioFolder } from "../../../../../shared/types/audio-folder";

interface AudioAssetListProps {
  assets: AudioAsset[];
  categories: AudioCategory[];
  folders: AudioFolder[];

  onRename: (assetId: string, newName: string) => Promise<void>;
  onDelete: (assetId: string) => Promise<void>;

  onMove: (
    assetId: string,
    categoryId: string,
    folderRelativePath?: string,
  ) => Promise<void>;

  onAddToCanvas: (asset: AudioAsset) => void;
}

const normalizePath = (value: string): string =>
  value.replace(/\\/g, "/").replace(/\/+$/, "");

const getParentPath = (relativePath: string): string => {
  const normalized = normalizePath(relativePath);
  const lastSeparator = normalized.lastIndexOf("/");

  return lastSeparator === -1 ? "" : normalized.slice(0, lastSeparator);
};

export const AudioAssetList = ({
  assets,
  categories,
  folders,
  onRename,
  onDelete,
  onMove,
  onAddToCanvas,
}: AudioAssetListProps) => {
  const [newAssetNames, setNewAssetNames] = useState<Record<string, string>>(
    {},
  );

  const [destinationCategoryIds, setDestinationCategoryIds] = useState<
    Record<string, string>
  >({});

  const [destinationFolderPaths, setDestinationFolderPaths] = useState<
    Record<string, string>
  >({});

  return (
    <section>
      <h2>Arquivos de Áudio</h2>

      {assets.map((asset) => {
        const selectedCategoryId =
          destinationCategoryIds[asset.id] ?? asset.categoryId;

        const currentFolderPath = normalizePath(
          getParentPath(asset.relativePath),
        );

        const selectedCategory = categories.find(
          (category) => category.id === selectedCategoryId,
        );

        const isCurrentCategoryRoot =
          selectedCategoryId === asset.categoryId &&
          currentFolderPath ===
            normalizePath(selectedCategory?.relativePath ?? "");

        return (
          <div key={asset.id}>
            <p>{asset.name}</p>

            <input
              type="text"
              placeholder="Novo nome do áudio"
              value={newAssetNames[asset.id] ?? ""}
              onChange={(event) => {
                setNewAssetNames((current) => ({
                  ...current,
                  [asset.id]: event.target.value,
                }));
              }}
            />

            <button
              onClick={async () => {
                const newName = newAssetNames[asset.id]?.trim();

                if (!newName) {
                  return;
                }

                await onRename(asset.id, newName);

                setNewAssetNames((current) => ({
                  ...current,
                  [asset.id]: "",
                }));
              }}
            >
              Renomear
            </button>

            <button onClick={() => void onDelete(asset.id)}>Excluir</button>

            <button onClick={() => onAddToCanvas(asset)}>
              + Adicionar ao Canvas
            </button>

            <div>
              <select
                value={selectedCategoryId}
                onChange={(event) => {
                  setDestinationCategoryIds((current) => ({
                    ...current,
                    [asset.id]: event.target.value,
                  }));

                  setDestinationFolderPaths((current) => ({
                    ...current,
                    [asset.id]: "",
                  }));
                }}
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>

              <select
                value={destinationFolderPaths[asset.id] ?? ""}
                onChange={(event) => {
                  setDestinationFolderPaths((current) => ({
                    ...current,
                    [asset.id]: event.target.value,
                  }));
                }}
              >
                <option value="" disabled={isCurrentCategoryRoot}>
                  Raiz da categoria{" "}
                  {isCurrentCategoryRoot ? " (Local atual) " : ""}
                </option>

                {folders
                  .filter((folder) => folder.categoryId === selectedCategoryId)
                  .map((folder) => {
                    const currentFolderPath = normalizePath(
                      getParentPath(asset.relativePath),
                    );

                    const destinationPath = normalizePath(folder.relativePath);

                    const isCurrentFolder =
                      selectedCategoryId === asset.categoryId &&
                      currentFolderPath === destinationPath;

                    return (
                      <option
                        key={folder.relativePath}
                        value={folder.relativePath}
                        disabled={isCurrentFolder}
                      >
                        {folder.name}
                        {isCurrentFolder ? " (Local atual) " : ""}
                      </option>
                    );
                  })}
              </select>

              <button
                onClick={async () => {
                  const categoryId = selectedCategoryId;

                  const currentFolder = normalizePath(
                    getParentPath(asset.relativePath),
                  );

                  const destinationFolder = normalizePath(
                    destinationFolderPaths[asset.id] ||
                      categories.find((category) => category.id === categoryId)
                        ?.relativePath ||
                      "",
                  );

                  if (currentFolder === destinationFolder) {
                    console.log("O áudio já está nesta pasta.");
                    return;
                  }

                  await onMove(
                    asset.id,
                    categoryId,
                    destinationFolderPaths[asset.id] || undefined,
                  );

                  setDestinationCategoryIds((current) => {
                    const updated = { ...current };
                    delete updated[asset.id];
                    return updated;
                  });

                  setDestinationFolderPaths((current) => {
                    const updated = { ...current };
                    delete updated[asset.id];
                    return updated;
                  });
                }}
              >
                Mover áudio
              </button>
            </div>
          </div>
        );
      })}
    </section>
  );
};
