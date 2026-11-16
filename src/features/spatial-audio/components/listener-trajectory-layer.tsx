import { Circle, Line } from "react-konva";

import type { Point } from "../types/point";

interface ListenerTrajectoryLayerProps {
    waypoints: Point[];
}

export const ListenerTrajectoryLayer = ({
    waypoints
}: ListenerTrajectoryLayerProps) => {
    const linePoints = waypoints.flatMap(
        point => [point.x, point.y]
    );

    return (
        <>
            {waypoints.length >= 2 && (
                <Line 
                    points={linePoints}
                    stroke="14b8a6"
                    strokeWidth={2}                
                    dash={[8, 5]}
                    listening={false}
                />
            )}

            {waypoints.map((point, index) => (
                <Circle
                    key={index}                
                    x={point.x}
                    y={point.y}
                    radius={7}
                    fill="14b8a6"
                    stroke="ffffff"
                    strokeWidth={1}
                    listening={false}
                />
            ))}
        </>
    )
}