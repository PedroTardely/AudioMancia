import type { Point } from "../../types/point";

import { calculateMovement } from "./calculate-movement";

export interface TrajectoryProgress {
    position: Point;
    waypointIndex: number;
    completed: boolean;
}

export const advanceListenerTrajectory = (
    current: Point,
    waypoints: Point[],
    waypointIndex: number,
    speed: number,
    deltaTime: number
): TrajectoryProgress => {
    let position = current;
    let index = waypointIndex;
    let remainingTime = deltaTime;

    if (
        !Number.isFinite(speed) ||
        !Number.isFinite(deltaTime) ||
        speed <= 0 ||
        deltaTime <= 0
    ) {
        return {
            position,
            waypointIndex,
            completed: index >= waypoints.length
        };
    }

    while (
        index < waypoints.length &&
        remainingTime > 0
    ) {
        const target = waypoints[index];

        const distance = Math.hypot(
            target.x - position.x,
            target.y - position.y
        );

        if (distance === 0) {
            index++;
            continue;
        }

        const travelTime = distance / speed;

        if (travelTime <= remainingTime) {
            position = target;
            remainingTime -= travelTime;
            index++;
        } else {
            position = calculateMovement(
                position,
                target,
                speed,
                remainingTime
            );

            remainingTime = 0;
        }
    }

    return {
        position,
        waypointIndex: index,
        completed: index >= waypoints.length
    }
}