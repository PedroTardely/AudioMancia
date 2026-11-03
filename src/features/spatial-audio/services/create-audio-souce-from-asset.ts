import type { AudioAsset } from "../../../../shared/types/audio-asset";
import type { AudioSource } from "../types/audio-source";
import type { Point } from "../types/point";



export const createAudioSourceFromAsset = (
    asset: AudioAsset,
    position: Point
): AudioSource => {

    const source: AudioSource = {
        id: crypto.randomUUID(),
        assetId: asset.id,
        baseVolume: 1,
        loop: true,
        position,

        shape: {
            type: 'circle',
            radius: 300
        }
    };

    return source;
}