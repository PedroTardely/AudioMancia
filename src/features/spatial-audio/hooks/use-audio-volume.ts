// ---------------* SERVICES * --------------------------
import { calculateProximityVolume } from "../services/calculate-proximity-volume";

// ---------------* TYPES * --------------------------
import type { Listener } from "../types/listener";
import type { AudioSource } from "../types/audio-source";

// ---------------* CUSTOM HOOKS * --------------------------
import { setAudioVolume } from "../../audio/services/audio-player";

// ---------------* REACT HOOKS * --------------------------
import { useEffect } from "react";

export const useProximityVolumeSync = ( listener:Listener, audioSources: AudioSource[]) => {

    useEffect(() => {
        audioSources.forEach((audioSource) => {
            const volume = calculateProximityVolume(listener, audioSource);

            setAudioVolume(audioSource.id, volume);
        });
    },[listener, audioSources]);
};