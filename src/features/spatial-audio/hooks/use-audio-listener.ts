import { useState } from "react";
import type { Point } from "../types/point";
import type { Listener } from "../types/listener";
import { initialAudioListener } from "../services/initial-audio-sources";

export const useAudioListener = () => {
    const [listener, setListener] = useState<Listener>(initialAudioListener);

    const updateListenerPosition = (
        newPosition: Point
    ) => {
        setListener((currentListener) => ({
            ...currentListener,
            position: newPosition
        }));
    };

    return {
        listener, updateListenerPosition
    };
};