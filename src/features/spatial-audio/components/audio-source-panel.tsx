import type { AudioSource } from "../types/audio-source";

interface AudioSourcePanelProps {
    source: AudioSource;
    assetName: string;

    onPlay: (source: AudioSource) => void;
    onLoop: (source: AudioSource) => void;
    onPause: (source: AudioSource) => void;
    onStop: (source: AudioSource) => void;

    onVolumeChange: (id: string, volume: number) => void;
    onRadiusChange: (id: string, radius: number) => void;

    onRemove: (id: string) => void;
}

export const AudioSourcePanel = ({
    source,
    assetName,
    onPlay,
    onLoop,
    onPause,
    onStop,
    onVolumeChange,
    onRadiusChange,
    onRemove
}:  AudioSourcePanelProps) => {
    return (
        <div>
            <h3>Fonte de Audio: {assetName}</h3>
            <div>
                <button onClick={() => onPlay(source)}>
                    Play
                </button>
                
                <button onClick={() => onLoop(source)}>
                    Loop
                </button>

                <button onClick={() => onPause(source)}>
                    Pause
                </button>

                <button onClick={() => onStop(source)}>
                    Stop
                </button>
            </div>

            <label>
                Volume base: {Math.round(source.baseVolume * 100)}%

                <input 
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={source.baseVolume}
                onChange={(event) =>
                    onVolumeChange(
                        source.id,
                        Number(event.target.value)
                    )
                }
                 />
            </label>

            {source.shape.type === 'circle' && (
                <label>
                    Raio: {source.shape.radius}

                    <input 
                    type="range"
                    min={50}
                    max={1000} 
                    step={10}
                    value={source.shape.radius}
                    onChange={(event) => 
                        onRadiusChange(
                            source.id,
                            Number(event.target.value)
                        )
                    }
                    />
                </label>
            )}

            <button onClick={() => onRemove(source.id)}>
                Remover do Canvas
            </button>

        </div>
    )
}