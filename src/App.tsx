import { InfiniteCanvas } from "./features/spatial-audio/components/spatial-audio-canvas";
import { CircleModel } from "./features/spatial-audio/components/listener-node";
import { CircleModelSource } from "./features/spatial-audio/components/circle-model-source";
import { getAudioContext } from "./features/audio/services/audio-context";

// ------- *custom hooks* -------
import { useSpatialAudio } from "./features/spatial-audio/hooks/use-spatial-audio";
import { useAudioSources } from "./features/spatial-audio/hooks/use-audio-sources";
import { useAudioListener } from "./features/spatial-audio/hooks/use-audio-listener";
import { useProximityVolumeSync } from "./features/spatial-audio/hooks/use-audio-volume";
import { useAudioLibrary } from "./features/spatial-audio/audio-library/hooks/use-audio-library";
import { useState } from "react";

function App() {
  // -------------*Apenas Teste*-----------------
  const handleTestAudioContext = () => {
    const context = getAudioContext();

    console.log(context);
    console.log("Estado:", context.state);
    console.log("Tempo:", context.currentTime);
    console.log("Sample rate:", context.sampleRate);
  };

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
  const { audioSources, updateSourcePosition } = useAudioSources();

  // ---------------* Audio Listener *----------------
  const { listener, updateListenerPosition } = useAudioListener();

  // ---------------* Volume * -----------------------

  useProximityVolumeSync(listener, audioSources);

  // ---------------* Audio Controlers * -------------

  const { playSource, playSourceLoop, pauseSource } = useSpatialAudio(
    listener,
    audioSources,
  );

  //---------------------------

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

  const [newAssetNames, setNewAssetNames] = useState<Record<string, string>>(
    {},
  );

  const [destinationCategoryIds, setDestinationCategoryIds] = useState<
    Record<string, string>
  >({});

  const [destinationFolderPaths, setDestinationFolderPaths] = useState<
    Record<string, string>
  >({});

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
          <button onClick={() => deleteFolder(folder.relativePath)}>
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

      {assets.map((asset) => (
        <div key={asset.id}>
          <p>{asset.name}</p>

          <input
            type="text"
            value={newAssetNames[asset.id] || ""}
            onChange={(event) =>
              setNewAssetNames((current) => ({
                ...current,
                [asset.id]: event.target.value,
              }))
            }
            placeholder="Novo nome do áudio"
          />

          <button
            onClick={async () => {
              const newName = newAssetNames[asset.id]?.trim();

              if (!newName) {
                return;
              }

              await renameAsset(asset.id, newName);

              setNewAssetNames((current) => ({
                ...current,
                [asset.id]: "",
              }));
            }}
          >
            Renomear áudio
          </button>

          <button onClick={() => deleteAsset(asset.id)}>Excluir áudio</button>

          <select
            value={destinationCategoryIds[asset.id] || ""}
            onChange={(event) => {
              const categoryId = event.target.value;

              setDestinationCategoryIds((current) => ({
                ...current,
                [asset.id]: categoryId,
              }));

              setDestinationFolderPaths((current) => ({
                ...current,
                [asset.id]: "",
              }));
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
            value={destinationFolderPaths[asset.id] || ""}
            onChange={(event) =>
              setDestinationFolderPaths((current) => ({
                ...current,
                [asset.id]: event.target.value,
              }))
            }
          >
            <option value=""> Raiz da categoria</option>

            {folders
              .filter(
                (folder) =>
                  folder.categoryId === destinationCategoryIds[asset.id],
              )
              .map((folder) => (
                <option key={folder.relativePath} value={folder.relativePath}>
                  {folder.name}
                </option>
              ))}
          </select>

          <button
            onClick={async () => {
              const destinationCategoryId = destinationCategoryIds[asset.id];

              if (!destinationCategoryId) {
                return;
              }

              const destinationFolderRelativePath =
                destinationFolderPaths[asset.id] || undefined;

              await moveAsset(
                asset.id,
                destinationCategoryId,
                destinationFolderRelativePath,
              );

              setDestinationCategoryIds((current) => ({
                ...current,
                [asset.id]: "",
              }));

              setDestinationFolderPaths((current) => ({
                ...current,
                [asset.id]: "",
              }));
            }}
          >
            Mover áudio
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

      {assets.map((asset) => (
        <p key={asset.id}>{asset.name}</p>
      ))}
      <h3>Pastas</h3>
      {folders.map((folder) => (
        <p key={folder.relativePath}>{folder.name}</p>
      ))}
      <p>
        Posição do ouvinte: ({listener.position.x}, {listener.position.y})<br />
      </p>
      {audioSources.map((audioSource) => (
        <div key={audioSource.id}>
          <p>
            Posição da fonte do áudio: ({audioSource.position.x},{" "}
            {audioSource.position.y})
          </p>
          <p>
            Raio da fonte do áudio: {audioSource.shape.radius}
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
      <button onClick={handleTestAudioContext}>Testar AudioContext</button>
      {audioSources.map((audioSource) => (
        <div key={audioSource.id}>
          <button onClick={() => playSource(audioSource)}>
            Play Audio: {audioSource.id}
          </button>
          <br />
          <button onClick={() => playSourceLoop(audioSource)}>
            Loop Audio: {audioSource.id}
          </button>
          <br />
          <button onClick={() => pauseSource(audioSource)}>
            Pause Audio: {audioSource.id}
            <div></div>
          </button>
        </div>
      ))}
      {/* ------------------------------- */}
      <InfiniteCanvas>
        <CircleModel
          size={20}
          position={listener.position}
          onMove={updateListenerPosition}
        />
        {audioSources.map((audioSource) => (
          <CircleModelSource
            key={audioSource.id}
            size={30}
            position={audioSource.position}
            radius={audioSource.radius}
            onMove={(newPosition) => {
              updateSourcePosition(audioSource.id, newPosition);
            }}
          />
        ))}
        {/* --------------------------------- */}
      </InfiniteCanvas>
    </main>
  );
}

export default App;
