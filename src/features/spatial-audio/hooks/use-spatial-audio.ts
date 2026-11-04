// ------- *CUSTOM HOOKS* --------
import { useProximityVolumeSync } from "./use-audio-volume";

// --------- * TYPES * -----------
import type { Listener } from "../types/listener";
import type { AudioSource } from "../types/audio-source";

// ------* AUDIO SERVICES * -------
import { playAudio, playLoopAudio, pauseAudio, stopAudio } from "../../audio/services/audio-player";
import { calculateProximityVolume } from "../services/calculate-proximity-volume";
import type { AudioAsset } from "../../../../shared/types/audio-asset";
import { resolveAudioAsset } from "../services/resolve-audio-asset";

export const useSpatialAudio = (listener: Listener, audioSources: AudioSource[], assets: AudioAsset[]) => {
    useProximityVolumeSync(listener, audioSources);

    const findAsset = (
        assetId: string,
        assets: AudioAsset[]
    ): AudioAsset | undefined => {

        return assets.find(asset => asset.id === assetId)
    }

    const playSource = async (
        audioSource: AudioSource
    ) => {

        const asset = findAsset(audioSource.assetId, assets);

        if (!asset) {
            console.error("AudioAsset não encontrado");
            return;
        }

        const audioUrl = resolveAudioAsset(asset);

        const volume = calculateProximityVolume(
            listener,
            audioSource
        );

        await playAudio(
            audioSource.id,
            audioUrl,
            volume);
    };

    const playSourceLoop = async (
        audioSource: AudioSource
    ) => {
        const asset = findAsset(audioSource.assetId, assets);

        if (!asset) {
            console.error("AudioAsset não encontrado");
            return;
        }

        const audioUrl = resolveAudioAsset(asset);

        const volume = calculateProximityVolume(
            listener,
            audioSource
        );

        await playLoopAudio(
            audioSource.id, 
            audioUrl, 
            volume);
    };

    const pauseSource = (
        audioSource: AudioSource
    ) => {
        pauseAudio(audioSource.id);
    };

    const stopSource = (
        audioSource: AudioSource
    ) => {
        stopAudio(audioSource.id)
    }

    return {
        playSource,
        playSourceLoop,
        pauseSource,
        stopSource
    };
};