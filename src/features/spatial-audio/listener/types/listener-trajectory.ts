import type { Point } from "../../types/point";

export interface ListenerTrajectory {
    id: string;
    name: string;

    waypoints: Point[];

    speed: number;

    loop: boolean;
}