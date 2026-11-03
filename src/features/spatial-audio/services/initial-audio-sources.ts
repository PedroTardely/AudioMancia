import type { AudioSource } from "../types/audio-source"
import type { Listener } from "../types/listener"

export const initialAudioSources: AudioSource[] = [
    {
      id: "1",
      audioPath: "/audios/869517__logicmoon__alone-in-a-temporary-place.wav",
      radius: 300,
      baseVolume: 1,
      loop: false,
      position: { x: 350, y: 300 },
    },
    {
      id: "2",
      audioPath:
        "/audios/691001__christmaskrumble666__wind-outside-cave-bowers-cave-ut.wav",
      radius: 200,
      baseVolume: 1,
      loop: false,
      position: { x: 350, y: 300 },
    }
]

export const initialAudioListener: Listener =
    {
      position: { x: 250, y: 250 },
    };
