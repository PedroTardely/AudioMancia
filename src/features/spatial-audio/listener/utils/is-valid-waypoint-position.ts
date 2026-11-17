import type { Point } from "../../types/point";

export const MIN_WAYPOINT_DISTANCE = 20;

export const isValidWaypointPosition = (
    position: Point,
    waypoints: Point[],
    ignoredIndex?: number
): boolean => {
    if (
        !Number.isFinite(position.x) ||
        !Number.isFinite(position.y)
    ) {
        return false;
    }

    return waypoints.every((waypoint, index) => {
        if (index === ignoredIndex) return true;

        const distance = Math.hypot(
            position.x - waypoint.x,
            position.y - waypoint.y
        );

        return distance >= MIN_WAYPOINT_DISTANCE;
    })
}