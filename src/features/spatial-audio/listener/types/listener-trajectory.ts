import type { Point } from "../../types/point";

export interface ListernerTrajectory {
    id: string;
    name: string;

    waypoints: Point[];

    speed: number;

    loop: boolean;
}