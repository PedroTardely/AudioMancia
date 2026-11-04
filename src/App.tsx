import { InfiniteCanvas } from "./features/spatial-audio/components/spatial-audio-canvas";
import { CircleModel } from "./features/spatial-audio/components/listener-node";
import { CircleModelSource } from "./features/spatial-audio/components/circle-model-source";
import { disposeAudio } from "./features/audio/services/audio-player";

// ------- *features* -------
import { AudioSourcePanel } from "./features/spatial-audio/components/audio-source-panel";
import { AudioLibraryPanel } from "./features/spatial-audio/audio-library/components/audio-library-panel";

// ------- *custom hooks* -------
import { useSpatialAudio } from "./features/spatial-audio/hooks/use-spatial-audio";
import { useAudioSources } from "./features/spatial-audio/hooks/use-audio-sources";
import { useAudioListener } from "./features/spatial-audio/hooks/use-audio-listener";
import { useAudioLibrary } from "./features/spatial-audio/audio-library/hooks/use-audio-library";
import { useState } from "react";


function App() {
  // -------------*Apenas Teste*-----------------

  const testElectron = async () => {
    const response = await window.electronAPI.ping();

    console.log(response);
  };

  const {
    categories,
    assets,
    folders,
    importAudio,
    createFolder,
    createCategory,
    renameCategory,
    deleteCategory,
    deleteFolder,
    deleteAsset,
    renameFolder,
    renameAsset,
    moveAsset,
    moveFolder,
  } = useAudioLibrary();
  // -------------**************-----------------

  // --------------* Audio Source *-------------------
  const { 
    audioSource, 
    updateSourcePosition, 
    addAudioSource,
    updateSourceBaseVolume,
    removeAudioSource,
    updateSourceRadius
  } = useAudioSources();

  // ---------------* Audio Listener *----------------
  const { listener, updateListenerPosition } = useAudioListener();


  const { playSource, playSourceLoop, pauseSource, stopSource } = useSpatialAudio(
    listener,
    audioSource,
    assets
  );

  //---------------------------

  const handleRemoveSource = (id: string): void => {
    disposeAudio(id);
    removeAudioSource(id);
  };

  // ---------------* Pastas * -------------

  const [categoryName, setCategoryName] = useState("");
  const [newCategoryNames, setNewCategoryNames] = useState<
    Record<string, string>
  >({});
  const [folderName, setFolderName] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");

  const handleCreateFolder = async () => {
    if (!folderName.trim()) {
      return;
    }

    if (!selectedCategoryId) {
      return;
    }

    await createFolder(
      folderName.trim(),
      selectedCategoryId,
      selectedFolderPath || undefined,
    );

    setFolderName("");
  };

  const handleDeleteAsset = async (
    assetId: string
  ): Promise<void> => {
    const isUsed = audioSource.some(
      source => source.assetId === assetId
    );

    if (isUsed) {
      console.warn(
        'Este áudio está sendo utilizado no canvas.'
      );
      return
    }

    await deleteAsset(assetId);
  };

  const handleDeleteFolder = async(
    relativePath: string
  ): Promise<void> => {
    try {
      await deleteFolder(relativePath);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Não foi possível excluir a pasta.';

      console.error('Error ao excluir pasta:', message);

      window.alert(
        'Não foi possível excluir a pasta.\n' +
        'Verifique se ela está vazia'
      );
    }
  };

  const handleCreateCategory = async () => {
    if (!categoryName.trim()) {
      return;
    }

    await createCategory(categoryName.trim());

    setCategoryName("");
  };

  const [selectedFolderPath, setSelectedFolderPath] = useState("");

  // --------------------------
  const [newFolderNames, setNewFolderNames] = useState<Record<string, string>>(
    {},
  );

  const [destinationFolderCategoryIds, setDestinationFolderCategoryIds] =
    useState<Record<string, string>>({});

  const [destinationParentFolderPaths, setDestinationParentFolderPaths] =
    useState<Record<string, string>>({});


  //---------------------------

  return (
    <main>
      <h1>Software Imersivo de Áudio</h1>
      <button onClick={testElectron}>Testar Electron API</button>
      <button
        onClick={() => {
          if (!selectedCategoryId) {
            return;
          }

          importAudio(selectedCategoryId, selectedFolderPath || undefined);
        }}
      >
        Importar áudio
      </button>

      {folders.map((folder) => (
        <div key={folder.relativePath}>
          <p>{folder.name}</p>
          <input
            type="text"
            value={newFolderNames[folder.relativePath] || ""}
            onChange={(event) =>
              setNewFolderNames((current) => ({
                ...current,
                [folder.relativePath]: event.target.value,
              }))
            }
            placeholder="Novo nome"
          />
          <button
            onClick={async () => {
              const newName = newFolderNames[folder.relativePath]?.trim();
              if (!newName) {
                return;
              }
              await renameFolder(folder.relativePath, newName);

              setNewFolderNames((current) => ({
                ...current,
                [folder.relativePath]: "",
              }));
            }}
          >
            Renomear
          </button>
          <button onClick={() => {
            void handleDeleteFolder(folder.relativePath);
          }}>
            Excluir Pasta
          </button>
          <select
            value={destinationFolderCategoryIds[folder.relativePath] || ""}
            onChange={(event) => {
              const categoryId = event.target.value;

              setDestinationFolderCategoryIds((current) => ({
                ...current,
                [folder.relativePath]: categoryId,
              }));

              setDestinationParentFolderPaths((current) => ({
                ...current,
                [folder.relativePath]: "",
              }));
            }}
          >
            <option value="">
              Selecione uma categoria de destino
            </option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <select
            value={destinationParentFolderPaths[folder.relativePath] || ""}
            onChange={(event) =>
              setDestinationParentFolderPaths((current) => ({
                ...current,
                [folder.relativePath]: event.target.value,
              }))
            }
          >
            <option value="">Raiz da categoria</option>

            {folders
              .filter(
                (destinationFolder) =>
                  destinationFolder.categoryId ===
                  destinationFolderCategoryIds[
                    folder.relativePath
                  ],
              )
              .filter(
                (destinationFolder) => {
                const isSameFolder = 
                  destinationFolder.relativePath ===
                  folder.relativePath;

                const isChildFolder = 
                  destinationFolder.relativePath.startsWith(
                    folder.relativePath + "\\"
                  ) ||
                  destinationFolder.relativePath.startsWith(
                    folder.relativePath + "/"
                  );

                  return !isSameFolder && !isChildFolder;
                })
              .map((destinationFolder) => (
                <option
                  key={destinationFolder.relativePath}
                  value={destinationFolder.relativePath}
                >
                  {destinationFolder.name}
                </option>
              ))}
          </select>
          <button
            onClick={async () => {
              const destinationCategoryId =
                destinationFolderCategoryIds[
                  folder.relativePath
                ];

              if (!destinationCategoryId) {
                return;
              }

              const destinationFolderRelativePath =
                destinationParentFolderPaths[
                  folder.relativePath
                ] || undefined;
              
              await moveFolder(
                folder.relativePath,
                destinationCategoryId,
                destinationFolderRelativePath
              );

              setDestinationFolderCategoryIds(
                (current) => ({
                  ...current,
                  [folder.relativePath]: "",
                })
              );

              setDestinationParentFolderPaths(
                (current) => ({
                  ...current,
                  [folder.relativePath]: "",
                })
              );
            }}
          >
            Mover pasta
          </button>
        </div>
      ))}

    

      <input
        type="text"
        value={folderName}
        onChange={(event) => setFolderName(event.target.value)}
        placeholder="Nome da pasta"
      />

      <select
        value={selectedCategoryId}
        onChange={(event) => {
          setSelectedCategoryId(event.target.value);
          setSelectedFolderPath("");
        }}
      >
        <option value="">Selecione uma categoria</option>

        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>

      <select
        value={selectedFolderPath}
        onChange={(event) => setSelectedFolderPath(event.target.value)}
      >
        <option value="">Raiz da Categoria</option>

        {folders
          .filter((folder) => folder.categoryId === selectedCategoryId)
          .map((folder) => (
            <option key={folder.relativePath} value={folder.relativePath}>
              {folder.name}
            </option>
          ))}
      </select>

      <button onClick={handleCreateFolder}>Criar pasta</button>

      <input
        type="text"
        value={categoryName}
        onChange={(event) => setCategoryName(event.target.value)}
        placeholder="Nome da categoria"
      />
      <button onClick={handleCreateCategory}>Criar Categoria</button>

      {categories.map((category) => (
        <div key={category.id}>
          <p>{category.name}</p>

          <input
            type="text"
            value={newCategoryNames[category.id] || ""}
            onChange={(event) =>
              setNewCategoryNames((current) => ({
                ...current,
                [category.id]: event.target.value,
              }))
            }
            placeholder="Novo nome da categoria"
          />

          <button
            onClick={async () => {
              const newName = newCategoryNames[category.id]?.trim();

              if (!newName) {
                return;
              }

              await renameCategory(category.id, newName);

              setNewCategoryNames((current) => ({
                ...current,
                [category.id]: "",
              }));
            }}
          >
            Renomear categoria
          </button>

          <button
            onClick={async () => {
              await deleteCategory(category.id);
            }}
          >
            Excluir categoria
          </button>
        </div>
      ))}
      <h3>Pastas</h3>
      {folders.map((folder) => (
        <p key={folder.relativePath}>{folder.name}</p>
      ))}
      <p>
        Posição do ouvinte: ({listener.position.x}, {listener.position.y})<br />
      </p>
      {audioSource.map((audioSource) => (
        <div key={audioSource.id}>
          <p>
            Posição da fonte do áudio: ({audioSource.position.x},{" "}
            {audioSource.position.y})
          </p>
          <p>
            Raio da fonte do áudio: {
                audioSource.shape?.type === 'circle'
                    ? audioSource.shape.radius
                    : 'Não disponível'    
            }
            <br />
            Volume base da fonte do áudio: {audioSource.baseVolume}
          </p>
          <p>
            {/* Volume final calculado: {volume.toFixed(2)} */}
            <br />
          </p>
        </div>
      ))}
      <div></div>
      {/* ------------------- */}
      {/* Audio-Library-Panel */}
      {/* ------------------- */}

      <AudioLibraryPanel
        assets={assets}
        categories={categories}
        folders={folders}
        onRenameAsset={renameAsset}
        onDeleteAsset={handleDeleteAsset}
        onMoveAsset={moveAsset}
        onAddToCanvas={(asset) => {
          addAudioSource(asset, {
            x: 350,
            y: 300
          });
        }}
      />

      {/* ------------------ */}

      {/* ------------------ */}
      {/* Audio-source-props */}
      {/* ------------------ */}

      {audioSource.map((audioSource) => {
        const asset = assets.find(
          asset => asset.id === audioSource.assetId
        );

        return(
          <AudioSourcePanel
            key={audioSource.id}
            source={audioSource}
            assetName={asset?.name ?? "Áudio não encontrado."}
            onPlay={playSource}
            onLoop={playSourceLoop}
            onPause={pauseSource}
            onStop={stopSource}
            onVolumeChange={updateSourceBaseVolume}
            onRadiusChange={updateSourceRadius}
            onRemove={handleRemoveSource}
        />
        )
      })}
      {/* ------------------ */}

      {/* ------------------ */}
      {/*   Canvas-Infinito  */}
      {/* ------------------ */}


      <InfiniteCanvas>
        <CircleModel
          size={20}
          position={listener.position}
          onMove={updateListenerPosition}
        />
        {audioSource.map((audioSource) => {
          if (audioSource.shape?.type !== 'circle') {
            return null;
          }
          
          return (
            <CircleModelSource
            key={audioSource.id}
            size={30}
            position={audioSource.position}
            radius={audioSource.shape.radius}
            onMove={(newPosition) => {
              updateSourcePosition(audioSource.id, newPosition);
            }}
          />
          );

        })}
        {/* --------------------------------- */}
      </InfiniteCanvas>
    </main>
  );
}

export default App;
