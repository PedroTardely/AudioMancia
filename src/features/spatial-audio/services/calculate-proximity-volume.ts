import type { Listener } from "../types/listener";
import type { AudioSource } from "../types/audio-source";
import { calculateDistance } from "../utils/calculate-distance";
import { normalizeScale } from "../utils/normalize-scale";
import type { CalculateProximityVolumeArgs } from "../types/proximity";



export function calculateProximityVolume (listener: Listener, audioSource: AudioSource): number {

    if (audioSource.shape.type !== "circle") {
        return 0;
    }

    const distance = calculateDistance(
        listener.position, audioSource.position
    );

    const volumeConfig: CalculateProximityVolumeArgs = {
        distMin: 0,
        distMax: audioSource.shape.radius,
        volumeMin: 0,
        volumeMax: audioSource.baseVolume
    }

    return normalizeScale(distance, volumeConfig);
}