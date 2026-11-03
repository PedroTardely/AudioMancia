import { getAudioContext } from './audio-context';

type AudioTrack = {
    audioPath: string;
    audioElement: HTMLAudioElement;
    sourceNode: MediaElementAudioSourceNode;
    gainNode: GainNode;
};

const audioTracks = new Map<string, AudioTrack>();

const initializeAudio = (id: string, audioPath: string): AudioTrack => {

    const existingTrack = audioTracks.get(id);

    if (existingTrack) {
        return existingTrack;
    }

    const context = getAudioContext();

    const audioElement = new Audio(audioPath);

    const sourceNode = context.createMediaElementSource(audioElement);

    const gainNode = context.createGain();



    sourceNode.connect(gainNode);
    gainNode.connect(context.destination);


    const track: AudioTrack = {
        audioPath,
        audioElement,
        sourceNode,
        gainNode
    };

    audioTracks.set(id, track);

    return track;
};

export const setAudioVolume = (id: string, volume: number) => {
    const track = audioTracks.get(id);

    if (!track) {
        return;
    }

    track.gainNode.gain.value = volume;
}

export const playAudio = async (id: string, audioPath: string, volume: number) => {
    const context = getAudioContext();

    const track = initializeAudio(id, audioPath);

    if (context.state === 'suspended') {
        await context.resume();
    }

    track.gainNode.gain.value = volume;

    track.audioElement.loop = false;

    await track.audioElement.play();
}

export const playLoopAudio = async (id: string, audioPath: string, volume: number) => {
    
    const context = getAudioContext();

    const track = initializeAudio(id, audioPath);

    if(context.state === 'suspended') {
        await context.resume();
    }

    track.gainNode.gain.value = volume;

    track.audioElement.loop = true;

    await track.audioElement.play();
};

export const pauseAudio = (id: string) => {
    const track = audioTracks.get(id);

    if (!track) {
        return;
    }

    track.audioElement.pause();

}
