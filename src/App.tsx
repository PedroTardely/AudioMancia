import type { Point } from "./features/spatial-audio/types/point";

import { SpatialWorkSpace } from "./features/spatial-audio/components/spatial-workspace";
import { disposeAudio } from "./features/audio/services/audio-player";

// ------- *utils* -------
import { isValidWaypointPosition } from "./features/spatial-audio/listener/utils/is-valid-waypoint-position";

// ------- *features* -------
import { AudioSourcePanel } from "./features/spatial-audio/components/audio-source-panel";
import { AudioLibraryPanel } from "./features/spatial-audio/audio-library/components/audio-library-panel";

// ------- *custom hooks* -------
import { useSpatialAudio } from "./features/spatial-audio/hooks/use-spatial-audio";
import { useAudioSources } from "./features/spatial-audio/hooks/use-audio-sources";
import { useAudioListener } from "./features/spatial-audio/hooks/use-audio-listener";
import { useAudioLibrary } from "./features/spatial-audio/audio-library/hooks/use-audio-library";
import { UseListenerMovement } from "./features/spatial-audio/listener/hooks/use-listener-movement";
import { useState } from "react";

function App() {
  // -------------*Apenas Teste*-----------------
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

    //---Waypoints----------------

  const [waypoints, setWaypoints] = useState<Point[]>([]);

  const [isWaypointEditing, setWaypointsEditing] = useState(false);

  const handleAddWaypoint = (position: Point) => {
    if (movementStatus !== 'idle') return;

    setWaypoints(current => {
      if (!isValidWaypointPosition(position, current)) {
        return current;
      }

      return [...current, position]
    });
  };

  const [selectedWaypointIndex, setSelectedWaypointIndex] =
    useState<number | null>(null);

  const handleReorderWaypoint = (
    direction: -1 | 1
  ) => {
    if (
      movementStatus !== 'idle' ||
      selectedWaypointIndex === null
    ) return;

    const  currentIndex = selectedWaypointIndex;
    const targetIndex = currentIndex + direction;

    if (
      currentIndex < 0 ||
      currentIndex >= waypoints.length ||
      targetIndex < 0 ||
      targetIndex >= waypoints.length
    ) return;

    setWaypoints(current => {
      const updated = [...current];

      [updated[currentIndex], updated[targetIndex]] = [
        updated[targetIndex],
        updated[currentIndex]
      ];

      return updated;
    });

    setSelectedWaypointIndex(targetIndex);
  }

  const handleDeleteSelectedWaypoint = () => {
    if (
      movementStatus !== 'idle' ||
      selectedWaypointIndex === null
    ) return;

    setWaypoints(current =>
      current.filter(
        (_, index) => index !== selectedWaypointIndex
      )
    );

    setSelectedWaypointIndex(null);
  };

  // ---------------* Audio Listener *----------------
  const { listener, updateListenerPosition } = useAudioListener();

  const {
    status: movementStatus,
    play: playMovement,
    pause: pauseMovement,
    resume: resumeMovement,
    stop: stopMovement
  } = UseListenerMovement ({
    position: listener.position,
    waypoints,
    speed: 80,
    loop: true,
    onPositionChange: updateListenerPosition
  });

  const handleManualListenerMove = (position: Point) => {
    pauseMovement();
    updateListenerPosition(position);
  }

  const handleMoveWaypoint = (
    index: number,
    position: Point
  ) => {
    if (movementStatus !== 'idle') return;

    setWaypoints(current => 
      current.map((point, currentIndex) =>
        currentIndex === index
          ? position
          :point
      )
    );
  };


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
 
  const handleDeleteAsset = async (
    assetId: string
  ): Promise<void> => {
    const isUsed = audioSource.some(
      source => source.assetId === assetId
    );
    
    // ---------------* Pastas * -------------
    
    if (isUsed) {
      throw new Error(
        'Este áudio está sendo utilizado no canvas. ' +
        'Remova todas as fontes associadas antes de excluí-lo.'
      );
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


  //---------------------------

  return (
    <main>
      <h1>Software Imersivo de Áudio</h1>

      {/* ------------------- */}
      {/* Audio-Library-Panel */}
      {/* ------------------- */}

      <AudioLibraryPanel
        onImportAudio={importAudio}
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
        onRenameCategory={renameCategory}
        onDeleteCategory={deleteCategory}
        onCreateFolder={createFolder}
        onRenameFolder={renameFolder}
        onDeleteFolder={handleDeleteFolder}
        onMoveFolder={moveFolder}
        onCreateCategory={createCategory}
      />

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
      {/*   Teste Movimento  */}
      {/* ------------------ */}

      <section>

        <h3>Movimento automático do Listener</h3>

        <p>Status: {movementStatus}</p>

        <button
          type="button"
          disabled={movementStatus !== 'idle'}
          onClick={() => {
            setWaypointsEditing(current => !current);
          }}
        >
          {isWaypointEditing
            ? 'Finalizar edição'
            : 'Adicionar Waypoints'
          }
        </button>

        <button 
          type="button"
          disabled={
            movementStatus !== 'idle' ||
            selectedWaypointIndex === null
          }
          onClick={handleDeleteSelectedWaypoint}
        >
          Excluir waypoint selecionado
        </button>

        <button
          type="button"
          disabled={
            movementStatus !== 'idle' ||
            waypoints.length === 0
          }
          onClick={() => {
             setWaypoints([]);
             setSelectedWaypointIndex(null);
          }}
        >
          Limpar trajetória
        </button>

        <button 
          type="button"
          disabled={
            movementStatus !== 'idle' ||
            selectedWaypointIndex === null ||
            selectedWaypointIndex === 0
          }
          onClick={() => handleReorderWaypoint(-1)}
        >
          Mover para anterior
        </button>

        <button 
          type="button"
          disabled={
            movementStatus !== 'idle' ||
            selectedWaypointIndex === null ||
            selectedWaypointIndex >= waypoints.length - 1
          }
          onClick={() => handleReorderWaypoint(1)}
        >
          Mover para próximo
        </button>

        <p>Waypoints: {waypoints.length}</p>

        <button
          type="button"
          onClick={playMovement}
          disabled={movementStatus === 'playing'}
        >
          Play Listener
        </button>

        <button
          type="button"
          onClick={pauseMovement}
          disabled={movementStatus !== 'playing'}
        >
          Pause Listener
        </button>

        <button
          type="button"
          onClick={resumeMovement}
          disabled={movementStatus !== 'paused'}
        >
          resume Listener
        </button>

        <button
          type="button"
          onClick={stopMovement}
          disabled={movementStatus === 'idle'}
        >
          stop Listener
        </button>



      </section>

      {/* ------------------ */}
      {/*   Canvas-Infinito  */}
      {/* ------------------ */}

      <SpatialWorkSpace
        listenerPosition={listener.position}
        audioSources={audioSource}
        onListenerMove={handleManualListenerMove}
        onSourceMove={updateSourcePosition}

        waypoints={waypoints}
        isWaypointEditing={
          isWaypointEditing &&
          movementStatus === 'idle'
        }

        onWaypointAdd={handleAddWaypoint}
        onWaypointMove={handleMoveWaypoint}

        selectedWaypointIndex={selectedWaypointIndex}
        onWaypointSelect={setSelectedWaypointIndex}
      />
    </main>
  );
}

export default App;
