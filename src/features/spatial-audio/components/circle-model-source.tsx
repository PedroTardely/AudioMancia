import { Group, Circle } from "react-konva";
import type { Point } from "../types/point";


interface CircleModelValues {
    size: number;
    radius: number;
    position: Point;
    onMove: (position: Point) => void;

}

export function CircleModelSource({size ,position , radius, onMove }: CircleModelValues) {
  return (
        <Group 
          x={position.x}
          y={position.y}
          draggable
          onDragMove={(event) => {
              event.cancelBubble = true;

              onMove({
                x: event.target.x(),
                y: event.target.y()
          });
          }}
        >
          
          <Circle
            x={0}
            y={0}
            radius={radius}
            fill="#e2e8f0"
            stroke="#475569"
            strokeWidth={4}
            opacity={0.2}
            listening={false}
          />

          <Circle
            x={0}
            y={0}
            radius={size}
            fill="#007bff"
          />

        </Group>
  );
}