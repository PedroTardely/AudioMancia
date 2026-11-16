import type { Point } from "../../types/point";

export const calculateMovement = (
    current: Point,
    target: Point,
    speed: number,
    deltaTime: number
): Point => {
    if (
        !Number.isFinite(speed) ||
        !Number.isFinite(deltaTime) ||
        speed <= 0 ||
        deltaTime <= 0
    ) {
        return current;
    }

    const dx = target.x - current.x;
    const dy = target.y - current.y;

    const distance = Math.hypot(dx, dy);

    if (distance === 0) {
        return target;
    }

    const maxMovement = speed * deltaTime;

    if (maxMovement >= distance) {
        return target;
    }

    const directionX = dx / distance;
    const directionY = dy / distance;

    return {
        x: current.x + directionX * maxMovement,
        y: current.y + directionY * maxMovement
    }
}