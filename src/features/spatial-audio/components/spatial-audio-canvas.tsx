import Konva from "konva";
import { Stage, Layer} from "react-konva";
import type { ReactNode } from "react";
import { useRef, useState } from 'react';

export interface Viewport {
  x: number;
  y: number;
  scale: number;
}

interface StageProps {
  children?: ReactNode;
}
export function InfiniteCanvas({children} : StageProps) {
    const stageRef = useRef<Konva.Stage | null>(null);
    const scaleBy = 1.1;
    const [viewport, setViewport] = useState<Viewport> ({
      x: 0,
      y: 0,
      scale: 1
    });
    const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
        
        e.evt.preventDefault();

        const stage = stageRef.current;
        if (!stage) {
          return;
        }

        const pointer = stage.getPointerPosition();

        if (!pointer) {
          return;
        }

        const mousePointTo = {
            x: (pointer.x - viewport.x) / viewport.scale,
            y: (pointer.y - viewport.y) / viewport.scale,
        };

        const isZoomIn = e.evt.deltaY < 0;
        const proposedScale = isZoomIn
        ? viewport.scale * scaleBy
        : viewport.scale / scaleBy;

        const minScale = 0.1;
        const maxScale = 10;
        const newScale = Math.max(minScale, Math.min(maxScale, proposedScale));

        const newPosition = {
            x: pointer.x - mousePointTo.x * newScale,
            y: pointer.y - mousePointTo.y * newScale,
        };

        setViewport({
          x: newPosition.x,
          y: newPosition.y,
          scale: newScale
        });
    };

    return (
    <Stage
      ref={stageRef}
      width={window.innerWidth}
      height={window.innerHeight}
      x={viewport.x}
      y={viewport.y}
      scaleX={viewport.scale}
      scaleY={viewport.scale}
      draggable // Equivalente a draggable={true}
      onWheel={handleWheel}
      onDragEnd={(event) => {
        if(event.target !== event.currentTarget) {
          return;
        }
        
        setViewport((currentViewport) => ({
          ...currentViewport,
          x: event.target.x(),
          y: event.target.y()
        }));
      }}
    >
      <Layer>
        {children}
      </Layer>
    </Stage>
  );
}