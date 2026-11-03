import type { Point } from '../types/point';

export function calculateDistance(
    pointA: Point,
    pointB: Point
): number {

    const deltaX = pointB.x - pointA.x;

    const deltaY = pointB.y - pointA.y;
    
    return Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
}