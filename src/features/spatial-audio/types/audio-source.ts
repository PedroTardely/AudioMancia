import type { AudioShape } from './audio-shape';
import type { Point } from './point';

export interface AudioSource {
    id: string;
    assetId: string;
    baseVolume: number;
    loop: boolean;
    position: Point;
    shape: AudioShape;
}