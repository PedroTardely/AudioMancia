import { useCallback, useEffect, useRef, useState } from "react";

import type { Point } from "../../types/point";

import { advanceListenerTrajectory } from "../services/advance-listener-trajectory";

type MovementStatus = 'idle' | 'playing' | 'paused';

interface UseListenerMovementProps {
    position: Point;
    waypoints: Point[];
    speed: number;
    loop: boolean;
    onPositionChange: (position: Point) => void;
}

export const UseListenerMovement = ({
    position,
    waypoints,
    speed,
    loop,
    onPositionChange
}: UseListenerMovementProps) => {
    const [status, setStatus] =
        useState<MovementStatus>('idle');

    const frameRef = useRef<number | null>(null);
    const lastTimeRef = useRef<number | null>(null);
    const waypointIndexRef = useRef(0);

    const positionRef = useRef(position);
    const statusRef = useRef<MovementStatus>('idle');

    const configRef = useRef({
        waypoints,
        speed,
        loop,
        onPositionChange
    });

    useEffect(() => {
        configRef.current = {
            waypoints,
            speed,
            loop,
            onPositionChange
        };
    }, [waypoints, speed, loop, onPositionChange]);

    useEffect(() => {
        if (statusRef.current !== 'playing') {
            positionRef.current = position;
        }
    }, [position]);
    

    const cancelFrame = useCallback(() => {
        if (frameRef.current !== null) {
            cancelAnimationFrame(frameRef.current);
            frameRef.current = null;
        }
    }, []);

    const animate = useCallback(function tick(timestamp: number) {
        if (statusRef.current !== 'playing') return;

        if (lastTimeRef.current === null) {
            lastTimeRef.current = timestamp;
            frameRef.current = requestAnimationFrame(tick);
            return;
        }

        const deltaTime =
            (timestamp - lastTimeRef.current) / 1000;

        lastTimeRef.current = timestamp;

        const config = configRef.current;

        const result = advanceListenerTrajectory(
            positionRef.current,
            config.waypoints,
            waypointIndexRef.current,
            config.speed,
            deltaTime
        );

        positionRef.current = result.position;
        waypointIndexRef.current = result.waypointIndex;

        config.onPositionChange(result.position);

        if (result.completed) {
            if (config.loop && config.waypoints.length > 0) {
                waypointIndexRef.current = 0;
            } else {
                statusRef.current = 'idle';
                setStatus('idle');
                frameRef.current = null;
                return;
            }
        }

        frameRef.current = requestAnimationFrame(tick);
    }, []);

    const play = useCallback(() => {
        const config = configRef.current;

        if (
            config.waypoints.length === 0 ||
            !Number.isFinite(config.speed) ||
            config.speed <= 0
        ) return;

        cancelFrame();

        waypointIndexRef.current = 0;
        lastTimeRef.current = null;

        statusRef.current = 'playing';
        setStatus('playing');

        frameRef.current = requestAnimationFrame(animate);
    }, [animate, cancelFrame]);

    const pause = useCallback(() => {
        if (statusRef.current !== 'playing') return;

        cancelFrame();

        lastTimeRef.current = null;
        statusRef.current = 'paused';
        setStatus('paused');
    }, [cancelFrame]);

    const resume = useCallback(() => {
        if (statusRef.current !== 'paused') return;

        lastTimeRef.current = null;
        statusRef.current = 'playing';
        setStatus('playing');

        frameRef.current = requestAnimationFrame(animate);
    }, [animate]);

    const stop = useCallback(() => {
        cancelFrame();

        waypointIndexRef.current = 0;
        lastTimeRef.current = null;

        statusRef.current = 'idle';
        setStatus('idle');
    }, [cancelFrame]);

    useEffect(() => {
        return () => {
            cancelFrame();
        };
    }, [cancelFrame]);

    return {
        status,
        play,
        pause,
        resume,
        stop
    }
}