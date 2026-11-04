import type { Point } from "./point";


export type AudioShape =
    |{
        type: 'circle';
        radius: number
    }
    | {
        type: 'polygon';
        points: Point[];
    }