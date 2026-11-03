import { useState } from "react";
import type { Point } from "../types/point";
import type { AudioSource } from "../types/audio-source";
import { initialAudioSources } from "../services/initial-audio-sources";

export const useAudioSources = () => {
    const [audioSources, setAudioSources] = useState<AudioSource[]>(initialAudioSources);

    const updateSourcePosition = (
        id: string,
        newPosition: Point
    ) => {
        setAudioSources((currentSources) => currentSources.map((source) => {
            if (source.id === id) {
                return {
                    ...source,
                    position: newPosition
                };
            }

            return source;
        })
        );
    };


    return { audioSources, updateSourcePosition }
}