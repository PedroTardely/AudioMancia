import type { AudioAsset } from "../../../../shared/types/audio-asset";

export const resolveAudioAsset = (
    asset: AudioAsset
): string => {
    return `rpg-audio://asset/${encodeURIComponent(asset.id)}`;
}