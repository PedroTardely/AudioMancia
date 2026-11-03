import type { CalculateProximityVolumeArgs } from "../types/proximity";


export function normalizeScale(distance: number, config: CalculateProximityVolumeArgs) :number {
    const { distMin, distMax, volumeMin, volumeMax} = config;
    if (volumeMin > volumeMax){throw new Error("Volume mínimo não pode ser maior que o volume máximo!");}
    if (distMin >= distMax){throw new Error("Distância mínima não pode ser maior ou igual a distância máxima!");}
    if (distance >= distMax) return volumeMin;
    if (distance <= distMin) return volumeMax;


    const volume = volumeMax - ((distance - distMin) * (volumeMax - volumeMin)/(distMax - distMin));
    return Math.max(volumeMin, Math.min(volumeMax, volume));
}
    