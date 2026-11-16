import { InfiniteCanvas } from "./spatial-audio-canvas";
import { CircleModel } from "./listener-node";
import { CircleModelSource } from "./circle-model-source";

import { ListenerTrajectoryLayer } from "./listener-trajectory-layer";

import type { Point } from "../types/point";
import type { AudioSource } from "../types/audio-source";

interface SpatialWorkSpaceProps {
    listenerPosition: Point;
    audioSources: AudioSource[];

    onListenerMove: (position: Point) => void;

    onSourceMove: (
        sourceId: string,
        position: Point
    ) => void;

    waypoints: Point[];
    isWaypointEditing: boolean;
    onWaypointAdd: (position: Point) => void;
}

export const SpatialWorkSpace = ({
    listenerPosition,
    audioSources,
    onListenerMove,
    onSourceMove,
    waypoints,
    isWaypointEditing,
    onWaypointAdd
}: SpatialWorkSpaceProps) => {
    return (
        <InfiniteCanvas
            isWaypointEditing={isWaypointEditing}
            onWaypointAdd={onWaypointAdd}
        >
            <ListenerTrajectoryLayer
                waypoints={waypoints}
            />
            
            <CircleModel
                size={20}
                position={listenerPosition}
                onMove={onListenerMove}
            />

            {audioSources.map((source) => {
                if (source.shape.type !== 'circle') {
                    return null;
                }

                return (
                    <CircleModelSource
                        key={source.id}
                        size={30}
                        position={source.position}
                        radius={source.shape.radius}
                        onMove={(position) => {
                            onSourceMove(source.id, position);
                        }}
                    />
                );
            })}
        </InfiniteCanvas>
    );
};