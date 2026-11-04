import { useState } from "react";

import type { AudioSource } from "../types/audio-source";
import type { AudioAsset } from "../../../../shared/types/audio-asset";
import type { Point } from "../types/point";

import { initialAudioSources } from "../services/initial-audio-sources";
import { createAudioSourceFromAsset } from "../services/create-audio-souce-from-asset";

export const useAudioSources = () => {
    const [audioSource, setAudioSource] =
        useState<AudioSource[]>(initialAudioSources);

    const updateSourcePosition = (
        id: string,
        position: Point
    ) => {
        setAudioSource((currentSources) =>
            currentSources.map((source) =>
                source.id === id
                    ? { ...source, position }
                    : source
            )
        );
    };

    const addAudioSource = (
        asset: AudioAsset,
        position: Point
    ) => {
        const newSource = createAudioSourceFromAsset(
            asset,
            position
        );

        setAudioSource((currentSources) => [
            ...currentSources,
            newSource
        ]);
    };

    const updateSourceBaseVolume = (
        id: string,
        volume: number
    ) => {
        const normalizeVolume = Math.max(
            0,
            Math.min(1, volume)
        );

        setAudioSource((currentSources) =>
            currentSources.map((source) =>
                source.id === id
                    ? {
                        ...source,
                        baseVolume: normalizeVolume
                    }
                    : source
            )
        );
    };

    const updateSourceRadius = (
        id: string,
        radius: number
    ): void => {
        const normalizeRadius = Math.max(1, radius);

        setAudioSource((currentSources) =>
            currentSources.map((source) => {
                if (
                    source.id !== id ||
                    source.shape.type !== 'circle'
                ) {
                    return source;
                }

                return {
                    ...source,
                    shape: {
                        ...source.shape,
                        radius: normalizeRadius
                    }
                };
            })
        );
    };

    const removeAudioSource = (id: string): void => {
        setAudioSource((currentSources) =>
            currentSources.filter(
                source => source.id !== id
            )
        );
    };


    return { 
        audioSource, 
        updateSourcePosition, 
        addAudioSource,
        updateSourceBaseVolume,
        removeAudioSource,
        updateSourceRadius
    }
}