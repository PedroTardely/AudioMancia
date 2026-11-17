import { Circle, Line } from "react-konva";

import type { Point } from "../types/point";

import { isValidWaypointPosition } from "../listener/utils/is-valid-waypoint-position";

interface ListenerTrajectoryLayerProps {
    waypoints: Point[];
    isEditing: boolean;

    onWaypointMove: (
        index: number,
        position: Point
    ) => void;

    selectedWaypointIndex: number | null;

    onWaypointSelect: (index: number) => void;
}

export const ListenerTrajectoryLayer = ({
    waypoints,
    isEditing,
    onWaypointMove
    ,selectedWaypointIndex,
    onWaypointSelect
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
                    fill={
                        selectedWaypointIndex === index
                        ? '#f59e0b'
                        : '#14b8a6'
                    }
                    stroke="ffffff"
                    strokeWidth={1}
                    draggable={isEditing}
                    listening={isEditing}
                    onClick={(event) => {
                        event.cancelBubble = true;
                        onWaypointSelect(index);
                    }}
                    onDragMove={(event) => {
                        const newPosition = {
                            x: event.target.x(),
                            y: event.target.y()
                        };

                        const isValid = isValidWaypointPosition(
                            newPosition,
                            waypoints,
                            index
                        );

                        if (!isValid) {
                            event.target.position(point);
                            return;
                        }

                        onWaypointMove(index, newPosition);
                    }}
                />
            ))}
        </>
    );
};