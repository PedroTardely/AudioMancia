import { app } from 'electron';
import path from 'node:path';
import { mkdirSync, readdirSync } from 'node:fs';
export const getAudioLibraryBasePath = () => {
    const userDataPath = app.getPath('userData');
    const libraryPath = path.join(userDataPath, 'library');
    return libraryPath;
};
export const initializeAudioLibrary = () => {
    const libraryPath = getAudioLibraryBasePath();
    mkdirSync(libraryPath, {
        recursive: true
    });
    const ambientesPath = path.join(libraryPath, 'ambientes');
    const efeitosPath = path.join(libraryPath, 'efeitos');
    const musicasPath = path.join(libraryPath, 'musicas');
    mkdirSync(ambientesPath, { recursive: true });
    mkdirSync(efeitosPath, { recursive: true });
    mkdirSync(musicasPath, { recursive: true });
};
const allowedExtensions = ['.mp3', '.wav', '.ogg'];
export const listAudioFiles = (category) => {
    const libraryPath = getAudioLibraryBasePath();
    const categoryPath = path.join(libraryPath, category);
    const files = readdirSync(categoryPath);
    const audioFiles = files.filter((file) => {
        const extension = path.extname(file).toLowerCase();
        return allowedExtensions.includes(extension);
    });
    const assets = audioFiles.map((file) => {
        return {
            name: file,
            path: path.join(categoryPath, file)
        };
    });
    return assets;
};
