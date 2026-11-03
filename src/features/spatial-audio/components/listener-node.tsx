import { Circle } from "react-konva";
import type { Point } from "../types/point";

interface CircleModelSize {
    size:   number;
    position: Point;
    onMove: (position: Point) => void;
}

export function CircleModel({ size ,position, onMove }: CircleModelSize) {
  return (
          <Circle
            x={position.x}
            y={position.y}
            radius={size}
            fill="#e2e8f0"
            stroke="#475569"
            strokeWidth={4}
            draggable
            onDragMove={(event) => {
                event.cancelBubble = true;

                onMove({
                  x: event.target.x(),
                  y: event.target.y()
            });
            }}
          />     
  );
}